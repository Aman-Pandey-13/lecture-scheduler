import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Users,
    title: "Instructor management",
    body: "Keep your teaching roster in one place and add new instructors in seconds.",
  },
  {
    icon: Layers,
    title: "Course batches",
    body: "Organize courses by level and schedule multiple lecture batches per course.",
  },
  {
    icon: ShieldCheck,
    title: "Clash-free scheduling",
    body: "The system blocks any assignment that would double-book an instructor — across every course.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-[-30%] -z-10 h-[70%] bg-[radial-gradient(ellipse_at_center,rgb(184_244_51_/_25%),transparent_62%)]" />
        <div className="mx-auto flex w-full max-w-[1220px] flex-col items-center px-4 pt-20 pb-16 text-center sm:px-8 sm:pt-28 sm:pb-24">
          <motion.span
            {...fadeUp}
            transition={{ duration: 0.4 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-border/70 bg-[#121a12]/70 px-4 py-1.5 text-[0.72rem] tracking-[0.1em] text-muted-foreground backdrop-blur"
          >
            <CalendarCheck className="size-3.5 text-primary" />
            No instructor ever double-booked
          </motion.span>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="max-w-[860px] font-heading text-5xl leading-[0.98] font-semibold tracking-[-0.04em] sm:text-7xl"
          >
            Scheduling that kills clashes before they happen.
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-[1.32rem]"
          >
            Manage instructors, build courses, and assign lecture batches — with
            automatic conflict detection that keeps every instructor's calendar
            clean across your entire catalog.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row"
          >
            <Button size="lg" className="min-w-42" render={<Link to="/login" />}>
              Get started
              <ArrowRight className="size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="min-w-42"
              render={<a href="#features" />}
            >
              See how it works
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto w-full max-w-[1220px] px-4 pb-24 sm:px-8"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-border bg-[linear-gradient(180deg,rgb(18_25_18_/_62%),rgb(10_15_10_/_88%))] p-6 shadow-[inset_0_1px_0_rgb(226_241_205_/_4%)]"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl border border-border bg-[#1b2a1a] text-primary">
                <feature.icon className="size-5" />
              </div>
              <h3 className="font-heading text-[1.7rem] leading-tight font-semibold tracking-[-0.02em]">
                {feature.title}
              </h3>
              <p className="mt-3 text-[1.02rem] leading-7 text-muted-foreground">
                {feature.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA band */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground sm:px-16">
          <h2 className="font-heading text-5xl leading-tight font-semibold tracking-[-0.03em]">
            Ready to schedule without conflicts?
          </h2>
          <p className="mx-auto mt-3 max-w-3xl text-base leading-8 text-primary-foreground/80">
            Sign in as an administrator to manage instructors and courses, or as
            an instructor to view your lecture schedule.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 bg-[#0b1208] text-white hover:bg-[#141d11]"
            render={<Link to="/login" />}
          >
            Sign in
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
