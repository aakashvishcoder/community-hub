import { motion } from 'framer-motion'

const FadeIn = ({ 
  children, 
  className = '',
  delay = 0,
  duration = 0.6,
  y = 20,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn