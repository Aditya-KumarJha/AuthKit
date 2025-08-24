import { BookText, Code, Wallet, ShieldCheck } from "lucide-react";

export default function Features() {
  const features = [
    { icon: <ShieldCheck />, title: "Secure Login", desc: "Email, username, and OTP authentication ready out-of-the-box." },
    { icon: <BookText />, title: "Social Sign-In", desc: "Google, GitHub, Facebook logins with minimal setup." },
    { icon: <Wallet />, title: "Web3 Wallets", desc: "MetaMask and WalletConnect support for decentralized apps." },
    { icon: <Code />, title: "Easy Integration", desc: "Plug & play into any web application with clean API." },
  ];

  return (
    <section className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-12 text-center">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="flex flex-col items-start gap-4 p-6 rounded-xl border transition-transform duration-300 
                       bg-white/50 border-gray-200 hover:shadow-lg hover:-translate-y-1
                       dark:bg-zinc-800 dark:border-zinc-700"
          >
            <div className="text-3xl">{f.icon}</div>
            <h3 className="text-xl font-semibold">{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
