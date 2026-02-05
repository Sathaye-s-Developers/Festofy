import React, { useContext, useEffect, useRef, useState } from 'react'
import { Calendar, Users, Zap, Shield } from "lucide-react"
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Features = () => {

  gsap.registerPlugin(ScrollTrigger);
  const boxref = useRef([]);
  const { contextSafe } = useGSAP();
  const boxAnimation = contextSafe(() => {

    boxref.current.forEach((box) => {
      if (!box) return;
      gsap.fromTo(
        box,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: box,
            start: "top 80%",
            toggleActions: "play none none reverse",
            once: true,
          },
          clearProps: "transform"
        }
      )
    })
  })
  const [activeFeature, setActiveFeature] = useState(null)
  const features = [
    {
      icon: Calendar,
      title: 'Event Planning',
      description: 'Streamline your event planning process with our intuitive tools'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team members in real-time'
    },
    {
      icon: Zap,
      title: 'Quick Setup',
      description: 'Get your events up and running in minutes, not hours'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Your data is protected with enterprise-grade security'
    }
  ];

  useEffect(() => {
    boxAnimation();
  }, []);

  return (
    <div className="mb-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 animate-fadeInUp">
        Why Choose <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Festofy?</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          const isActive = false
          return (
            <div ref={(el) => (boxref.current[index] = el)}
              key={feature.title}
              className={`group p-6 bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-cyan-400/20
             hover:border-cyan-400/40 hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer will-change-transform`}
              style={{
                animationDelay: `${index * 150}ms`
              }}
              onClick={() => setActiveFeature(isActive ? null : index)}
              onTouchStart={() => setActiveFeature(index)}
              onTouchEnd={() => setTimeout(() => setActiveFeature(null), 2000)}
            >
              <div className={`p-3 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl border border-cyan-400/30 w-fit mb-4 transition-all duration-300 ${isActive ? 'scale-110 border-cyan-400/60' : 'group-hover:scale-110'
                }`}>
                <IconComponent className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${isActive ? 'text-cyan-300' : 'text-white group-hover:text-cyan-300'
                }`}>
                {feature.title}
              </h3>
              <p className={`transition-colors duration-300 ${isActive ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
                }`}>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  )
}

export default Features
