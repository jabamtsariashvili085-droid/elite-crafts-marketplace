import { motion } from "framer-motion";
import graniteSinkImg from "@/assets/granite-sink.jpg";
import cncDeskImg from "@/assets/cnc-desk.jpg";
import kitchenExampleImg from "@/assets/kitchen-example.jpg";
import kitchenFullImg from "@/assets/kitchen-full.jpg";

export default function HeroContent() {
  return (
    <div className="relative z-10">
      {/* Hero Section with kitchen background */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6">
        {/* Kitchen background image */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <img
            src={kitchenExampleImg}
            alt="თანამედროვე სამზარეულო გრანიტის ზედაპირით"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
        </div>

        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative z-10 mb-8 rounded-full border border-gold-subtle bg-glass px-6 py-2"
        >
          <span className="font-body text-sm tracking-[0.3em] uppercase text-muted-foreground">
            პრემიუმ სამზარეულოს დიზაინი
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10 mb-6 text-center font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl lg:text-8xl"
        >
          <span className="block text-foreground">სამზარეულოს</span>
          <span className="text-gold-gradient">გრანიტის ნიჟარები</span>
          <span className="block mt-2 text-3xl font-medium text-muted-foreground md:text-4xl lg:text-5xl">
            & CNC პარამეტრული რეცეფცია
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="relative z-10 mb-12 max-w-2xl text-center font-body text-lg text-muted-foreground md:text-xl"
        >
          ელეგანტური სამზარეულოს გრანიტის ნიჟარები და პარამეტრული კედლის რეცეფციის მაგიდები — 
          შექმნილი უმაღლესი ხარისხის ბუნებრივი ქვისგან
        </motion.p>

        {/* Product showcase cards */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="relative z-10 flex flex-col gap-6 md:flex-row"
        >
          <ProductCard
            image={kitchenExampleImg}
            title="სამზარეულო"
            description="თანამედროვე სამზარეულოს სრული დიზაინი"
          />
          <ProductCard
            image={graniteSinkImg}
            title="გრანიტის ნიჟარა"
            description="ბუნებრივი შავი ქვის ელეგანტურობა"
          />
          <ProductCard
            image={cncDeskImg}
            title="CNC რეცეფცია"
            description="პარამეტრული კედლის დიზაინი"
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="relative z-10 mt-12 flex gap-4"
        >
          <button className="rounded-full bg-primary px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:scale-105 glow-gold">
            კატალოგის ნახვა
          </button>
          <button className="rounded-full border border-gold-subtle bg-glass px-8 py-3 font-body text-sm font-semibold uppercase tracking-widest text-foreground transition-all hover:scale-105">
            დაგვიკავშირდით
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-8 z-10 flex flex-col items-center gap-2"
        >
          <span className="font-body text-xs uppercase tracking-widest text-muted-foreground">scroll</span>
          <div className="h-12 w-px animate-glow-pulse bg-primary" />
        </motion.div>
      </section>

      {/* Kitchen Feature Section */}
      <section className="relative px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 text-center"
          >
            <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl">
              ჩვენი <span className="text-gold-gradient">პროდუქცია</span>
            </h2>
            <p className="mt-4 font-body text-lg text-muted-foreground">
              სამზარეულო, გრანიტის ნიჟარა და CNC რეცეფცია — ხარისხი და ესთეტიკა
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Large kitchen image */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="group relative overflow-hidden rounded-xl border border-gold-subtle"
            >
              <img
                src={kitchenFullImg}
                alt="თანამედროვე სამზარეულო"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-0 p-8">
                <h3 className="font-display text-2xl font-semibold text-foreground">
                  თანამედროვე სამზარეულო
                </h3>
                <p className="mt-2 font-body text-muted-foreground">
                  სრული სამზარეულოს დიზაინი — კარადები, ზედაპირები, ტექნიკა და განათება
                </p>
              </div>
            </motion.div>

            {/* Kitchen features list */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col justify-center gap-6"
            >
              <FeatureItem
                number="01"
                title="ბუნებრივი გრანიტი"
                description="უმაღლესი ხარისხის ბუნებრივი ქვა, გამძლე ნებისმიერი ტემპერატურისა და ზემოქმედებისთვის"
              />
              <FeatureItem
                number="02"
                title="ინტეგრირებული ნიჟარა"
                description="სამზარეულოს ზედაპირთან ერთიანი დიზაინი, უნაკერო მონტაჟი"
              />
              <FeatureItem
                number="03"
                title="CNC დამუშავება"
                description="პარამეტრული დიზაინის კომპიუტერული სიზუსტით დამუშავება"
              />
              <FeatureItem
                number="04"
                title="ინდივიდუალური ზომები"
                description="თქვენს სამზარეულოზე მორგებული ზომები და ფორმები"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCard({ image, title, description }: { image: string; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group relative w-64 overflow-hidden rounded-lg border border-gold-subtle bg-glass md:w-72"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 p-5">
        <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
        <p className="mt-1 font-body text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}

function FeatureItem({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="group flex gap-5 rounded-lg border border-gold-subtle bg-glass p-6 transition-all hover:glow-gold">
      <span className="font-display text-3xl font-bold text-gold-gradient text-primary opacity-50">
        {number}
      </span>
      <div>
        <h4 className="font-display text-lg font-semibold text-foreground">{title}</h4>
        <p className="mt-1 font-body text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
