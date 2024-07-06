import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";

interface ChildrenProps {
  children: JSX.Element;
}

export default function MotionWrapper({ children }: ChildrenProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
