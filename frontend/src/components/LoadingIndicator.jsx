// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function LoadingIndicator() {
  const bounceTransition = {
    y: {
      duration: 0.4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut",
    },
  };

  return (
    <div className="flex space-x-2 w-full justify-center items-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-3 h-3 bg-blue-500 rounded-full"
          animate={{ y: ["0%", "-100%"] }}
          transition={{ ...bounceTransition, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
}
