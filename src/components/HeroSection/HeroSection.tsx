import { Badge } from "../lightswind/badge";
import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <motion.div
      id="hero"
      className="text-foreground bg-transparent flex flex-col md:flex-row 
      items-center justify-center max-w-7xl mx-auto w-full"
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          // acts like staggerChildren / delayChildren
          delayChildren: 0.3,
          staggerChildren: 0.2,
        },
      }}
    >
      {/* Left Section */}
      <motion.div
        className="flex-1 space-y-4 p-6 text-left md:text-left"
        initial={false} // so it inherits parent animation
      >
        <motion.h1
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut" },
          }}
        >
          Sai Pavan Kumar . K
          {/* <motion.span
            className="text-sm text-pink-500 font-semibold block"
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.8, ease: "easeOut" },
            }}
          >
            She / Her
          </motion.span> */}
        </motion.h1>

        <motion.h2
          className="text-xl text-muted-foreground mt-1"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut" },
          }}
        >
        Frontend Developer | IT Professional
        </motion.h2>

        <motion.p
          className="mt-4 text-xs text-muted-foreground"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut" },
          }}
        >
      Experienced IT professional with 1+ years in HTML5, CSS3, JavaScript, React, Redux, 
      Git. Skilled in debugging, performance optimization, and building responsive UIs.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center md:justify-start gap-2"
          initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.8, ease: "easeOut" },
          }}
        >
          
          <Badge className="text-xs bg-pink-500">Problem Solving</Badge>
          <Badge className="text-xs bg-pink-500">Decision Making</Badge>
          <Badge className="text-xs bg-pink-500">Critical Thinking</Badge>
        </motion.div>
      </motion.div> 

      {/* Right Section */}
      {/* <motion.div
        className="flex-1 flex justify-center p-6"
        initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
        animate={{
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
      >
        <div className="w-54 h-54 rounded-full overflow-hidden shadow-lg">
          <img
            src="/myphoto.jpg"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </motion.div> */}

    {/* Right Section */}
<motion.div
  className="flex-1 flex justify-center items-center p-6"
  initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
  animate={{
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
  }}
  transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
>
  <div className="w-64 h-83 rounded-full overflow-hidden shadow-lg flex items-center justify-center">
    <img
      src="/myphoto.jpg"
      alt="Sai Pavan Kumar"
      // className="w-full h-full object-cover"
    />
  </div>
</motion.div>
    </motion.div>
  );
};
