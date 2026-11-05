
import CityIllustration from "./CityIllustration";
import {
  Compass,
  ArrowRight,
  School,
  BrainCircuit,
  Map,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

function LandingPage({ onGetStarted, onSignIn }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f7f3] text-[#26384a]">

      {/* NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-[#f8f7f3]/95 backdrop-blur-sm border-b border-[#e9e8e2]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#243b53] text-white flex items-center justify-center">
              <Compass size={23} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-[0.12em] text-[#243b53]">
                METRIX
              </h1>
              <p className="text-[9px] tracking-[0.13em] uppercase text-[#82909c]">
                Intelligent City Planning
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-9 text-sm text-[#778590]">
            <button onClick={() => scrollTo("about")} className="hover:text-[#243b53]">
              About
            </button>
            <button onClick={() => scrollTo("features")} className="hover:text-[#243b53]">
              Features
            </button>
            <button onClick={() => scrollTo("approach")} className="hover:text-[#243b53]">
              Our approach
            </button>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <button
              onClick={onSignIn}
              className="text-sm text-[#536779] hover:text-[#243b53]"
            >
              Sign in
            </button>
            <button
              onClick={onGetStarted}
              className="soft-button px-5 py-3 text-sm flex items-center gap-2"
            >
              Get started <ArrowRight size={16} />
            </button>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-5 space-y-4 bg-[#f8f7f3]">
            <button onClick={() => scrollTo("about")} className="block text-sm">About</button>
            <button onClick={() => scrollTo("features")} className="block text-sm">Features</button>
            <button onClick={() => scrollTo("approach")} className="block text-sm">Our approach</button>
            <button onClick={onSignIn} className="block text-sm">Sign in</button>
            <button onClick={onGetStarted} className="soft-button px-5 py-3 text-sm">
              Get started
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="max-w-xl">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#82988d] uppercase mb-6">
              A better way to think about our cities
            </p>

            <h1 className="serif-heading text-5xl md:text-6xl lg:text-7xl leading-[1.12] text-[#243b53]">
              CITIES GROW EVERY DAY.
              <span className="block italic text-[#849b8e] mt-2">
                Let's plan for tomorrow.
              </span>
            </h1>

            <p className="text-base text-[#788590] mt-7 leading-8 max-w-lg">
              Explore how places are growing, understand the facilities
              around them, and discover what better planning could look
              like with METRIX.
            </p>

            <div className="flex flex-wrap items-center gap-5 mt-9">
              <button
                onClick={onGetStarted}
                className="soft-button px-6 py-4 text-sm font-medium flex items-center gap-3"
              >
                Explore METRIX <ArrowRight size={17} />
              </button>

              <button
                onClick={() => scrollTo("about")}
                className="text-sm font-medium text-[#536d82] hover:text-[#243b53]"
              >
                Discover our approach →
              </button>
            </div>

            <div className="mt-12 flex items-center gap-3 text-xs text-[#929da4]">
              <span className="w-8 h-px bg-[#849b8e]" />
              Think ahead. Plan smarter.
            </div>
          </div>

          {/* CITY ILLUSTRATION */}
          <div className="relative">
            <div className="rounded-[28px] bg-[#eeeee6] border border-[#e5e5dc] overflow-hidden min-h-[350px] md:min-h-[480px] flex items-center justify-center p-5 md:p-8">

              <div className="w-full max-w-[540px]">
                <CityIllustration />
              </div>

              <div className="absolute bottom-5 left-5 bg-[#f8f7f3]/90 rounded-xl px-4 py-3 border border-white/70">
                <p className="text-[9px] tracking-wider text-[#82988d] uppercase">
                  Geographic coverage
                </p>
                <p className="text-sm font-semibold text-[#243b53] mt-1">
                  Karnataka, India
                </p>
              </div>
            </div>

            <div className="absolute -top-5 -right-3 md:-right-5 bg-[#e8e5f2] rounded-2xl px-4 py-3 shadow-sm">
              <p className="text-[10px] text-[#746b91] uppercase tracking-wider">
                Think ahead
              </p>
              <p className="serif-heading text-lg text-[#243b53]">
                Plan better.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-[#f0eee7] py-24">
        <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#82988d]">
            Why METRIX exists ?
          </p>

          <h2 className="serif-heading text-4xl md:text-5xl text-[#243b53] mt-5 leading-tight">
            A GROWING PLACE NEED 
            <span className="italic text-[#849b8e]"> MORE THAN GROWING BUILDINGS.</span>
          </h2>

          <p className="text-sm md:text-base text-[#788590] mt-7 leading-8 max-w-3xl mx-auto">
            As towns and cities expand, people need more roads, schools,
            hospitals and essential services. But are these facilities
            growing along with the people? METRIX helps us explore
            this question and think about what comes next.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="max-w-2xl mb-14">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#82988d]">
            Explore METRIX
          </p>
          <h2 className="serif-heading text-4xl md:text-5xl text-[#243b53] mt-4" whitespace-nowrap>
            FROM UNDERSTANDING PLACES TO IMAGINING POSSIBILITIES.
          </h2>
          <p className="text-sm text-[#929da4] mt-5 leading-7">
            Three simple ways to explore and think about better planning.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <div className="soft-card p-7">
            <div className="w-14 h-14 rounded-2xl bg-[#e5edf4] text-[#536d82] flex items-center justify-center">
              <Map size={25} />
            </div>
            <p className="text-[10px] tracking-widest text-[#82988d] mt-8">01 / EXPLORE</p>
            <h3 className="serif-heading text-2xl text-[#243b53] mt-3">
              EXPLORE PLACES
            </h3>
            <p className="text-sm text-[#84909a] mt-4 leading-7">
              Choose a district and taluk, explore their boundaries
              and understand the area you're planning for.
            </p>
          </div>

          <div className="soft-card p-7">
            <div className="w-14 h-14 rounded-2xl bg-[#dce8e2] text-[#617d70] flex items-center justify-center">
              <School size={25} />
            </div>
            <p className="text-[10px] tracking-widest text-[#82988d] mt-8">02 / UNDERSTAND</p>
            <h3 className="serif-heading text-2xl text-[#243b53] mt-3">
              UNDERSTAND WHAT'S AVAILABLE
            </h3>
            <p className="text-sm text-[#84909a] mt-4 leading-7">
              Explore available information about schools, hospitals
              and other facilities in your selected area.
            </p>
          </div>

          <div className="soft-card p-7">
            <div className="w-14 h-14 rounded-2xl bg-[#e8e5f2] text-[#746b91] flex items-center justify-center">
              <BrainCircuit size={25} />
            </div>
            <p className="text-[10px] tracking-widest text-[#82988d] mt-8">03 / IMAGINE</p>
            <h3 className="serif-heading text-2xl text-[#243b53] mt-3">
              IMAGINE WHAT COULD CHANGE
            </h3>
            <p className="text-sm text-[#84909a] mt-4 leading-7">
              Try different growth and infrastructure plans and
              explore AI-assisted insights.
            </p>
          </div>

        </div>
      </section>

      {/* GEOGRAPHIC COVERAGE */}
      <section className="bg-[#f1eee4] py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#82988d]">
            Our geographic coverage
          </p>

          <h2 className="serif-heading text-4xl text-[#243b53] mt-4">
            START WITH THE BIGGER PICTURE.
          </h2>

          <div className="grid sm:grid-cols-2 gap-8 mt-12">
            <div className="border-t border-[#d9d5c9] pt-6">
              <h3 className="serif-heading text-6xl text-[#243b53]">31</h3>
              <p className="text-sm text-[#536779] mt-2">District boundaries</p>
            </div>

            <div className="border-t border-[#d9d5c9] pt-6">
              <h3 className="serif-heading text-6xl text-[#243b53]">240</h3>
              <p className="text-sm text-[#536779] mt-2">Taluk boundaries</p>
            </div>
          </div>

          <p className="text-xs text-[#929080] mt-10 leading-6">
            Based on the processed Karnataka administrative boundary dataset.
            Other information is displayed according to actual data availability.
          </p>
        </div>
      </section>

      {/* APPROACH */}
      <section id="approach" className="max-w-7xl mx-auto px-6 md:px-10 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#82988d] font-semibold">
              What-if planning
            </p>
            <h2 className="serif-heading text-4xl md:text-5xl text-[#243b53] mt-5 leading-tight">
              WHAT IF WE PLANNED BEFORE THE NEED AROSE?
            </h2>
            <p className="text-sm text-[#788590] mt-6 leading-8">
              What if more people moved into an area? What if a new
              hospital or school was proposed? How might planning
              priorities change?
            </p>
            <p className="text-sm text-[#788590] mt-3 leading-8">
              METRIX lets you explore different possibilities through
              hypothetical scenarios and AI-assisted insights.
            </p>
            <button
              onClick={onGetStarted}
              className="soft-button px-6 py-4 mt-8 flex items-center gap-3 text-sm"
            >
              Explore the workspace <ArrowRight size={17} />
            </button>
          </div>

          <div className="rounded-[24px] bg-[#e8e5f2] p-8 md:p-12 min-h-[330px] flex flex-col justify-center">
            <div className="flex items-center gap-3 text-[#746b91]">
              <BrainCircuit size={22} />
              <p className="text-xs uppercase tracking-widest font-semibold">
                METRIX intelligence
              </p>
            </div>
            <h3 className="serif-heading text-3xl text-[#243b53] mt-8">
              EVERY DECISION SHAPES A DIFFERENT POSSIBILITY.
            </h3>
            <p className="text-sm text-[#817995] mt-5 leading-7">
              Change your assumptions. Explore possible outcomes.
              Think a little further ahead.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="bg-[#243b53] text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-white">
            Think ahead. Plan smarter.
          </p>
          <h2 className="serif-heading text-4xl md:text-5xl mt-6 leading-tight !text-white">
  LET'S MAKE BETTER PLANS FOR THE PLACES WE CALL HOME.
</h2>
          <p className="text-sm text-[#d2dce3] mt-6 leading-7">
            Explore your region, discover the possibilities and
            think a little further ahead.
          </p>
          <button
            onClick={onGetStarted}
            className="mt-9 inline-flex items-center gap-3 bg-[#e5ede8] hover:bg-white text-[#243b53] px-6 py-4 rounded-xl text-sm font-semibold transition"
          >
            Get started with METRIX <ArrowRight size={17} />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#f8f7f3] px-6 md:px-10 py-9">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-5 items-center">
          <div>
            <h3 className="font-bold tracking-[0.15em] text-[#243b53]">
              METRIX
            </h3>
            <p className="text-xs text-[#929da4] mt-2">
              AI-Assisted Data-Driven City Planning
            </p>
          </div>
          <p className="text-[10px] text-[#a0a7aa]">
            Think ahead. Plan smarter.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
