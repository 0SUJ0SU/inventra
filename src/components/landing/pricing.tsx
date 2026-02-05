"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For small shops getting started with inventory tracking.",
    features: [
      "Up to 100 products",
      "Basic stock tracking",
      "Simple POS interface",
      "Sales reports",
      "1 user account",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    description: "Full-featured inventory with serial tracking & warranties.",
    features: [
      "Unlimited products",
      "Serial number tracking",
      "Warranty management",
      "Customer database",
      "Supplier management",
      "Advanced reports",
      "5 user accounts",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For growing businesses with complex inventory needs.",
    features: [
      "Everything in Professional",
      "Unlimited users",
      "Multi-location support",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "On-premise deployment option",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-24 md:py-32 bg-[var(--background)] overflow-hidden"
    >
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(var(--text) 1px, transparent 1px),
                           linear-gradient(90deg, var(--text) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-[0.2em] uppercase text-[var(--accent-500)] dark:text-[var(--accent-400)] border border-[var(--accent-500)]/30 rounded-full">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--text)] dark:text-[var(--text-dark)] mb-6">
            <span className="font-fraunces italic font-normal">Simple,</span>{" "}
            <span className="font-space-grotesk">transparent pricing</span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-secondary)] dark:text-[var(--text-secondary-dark)] max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                tier.highlighted
                  ? "bg-[var(--surface)] dark:bg-[var(--surface-dark)] border-[var(--accent-500)] shadow-xl shadow-[var(--accent-500)]/10 scale-[1.02] md:scale-105"
                  : "bg-[var(--surface)] dark:bg-[var(--surface-dark)] border-[var(--border)] dark:border-[var(--border-dark)] hover:border-[var(--accent-500)]/50"
              }`}
            >
              {/* Popular Badge */}
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-block px-4 py-1 text-xs font-medium tracking-wider uppercase bg-[var(--accent-500)] text-white rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier Header */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold font-space-grotesk text-[var(--text)] dark:text-[var(--text-dark)] mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="text-4xl lg:text-5xl font-bold font-space-grotesk text-[var(--text)] dark:text-[var(--text-dark)]">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
                    {tier.period}
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[var(--text-secondary)] dark:text-[var(--text-secondary-dark)]"
                  >
                    <Check
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        tier.highlighted
                          ? "text-[var(--accent-500)]"
                          : "text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]"
                      }`}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant="ghost"
                className={`w-full h-12 text-base font-medium transition-all duration-300 ${
                  tier.highlighted
                    ? "bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white shadow-lg shadow-[var(--accent-500)]/25 hover:text-white"
                    : "bg-[var(--background)] dark:bg-[var(--background-dark)] border-2 border-[var(--border)] dark:border-[var(--border-dark)] text-[var(--text)] dark:text-[var(--text-dark)] hover:border-[var(--accent-500)] hover:bg-[var(--accent-500)]/10 hover:text-[var(--accent-600)] dark:hover:text-[var(--accent-400)]"
                }`}
              >
                {tier.cta}
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12 text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]"
        >
          All plans include a 14-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}
