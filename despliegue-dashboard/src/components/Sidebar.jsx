import { Home, ChartPie, Menu } from "lucide-react"
import '../index.css'
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Link } from "react-router-dom"
const scrollToTop = () => {
  const topElement = document.getElementById('top'); // Target the element with ID 'top'
  if (topElement) {
    topElement.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the element
  }
};
const SIDEBAR_ITEMS = [
  {name:"Inicio", icon: Home, color: 'var(--color-primary)', href:"/"},
  {name:"Tablero de Datos", icon: ChartPie, color: 'var(--color-secondary)', href: scrollToTop}

]

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen]= useState(true);

  

  return (
    <motion.div className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? 'w-64' : 'w-20'}`}
      animate={{width: isSidebarOpen ? 256 : 80}}
      transition={{duration: 0.2, delay: 0.1}}
    >
      <div className="h-full bg-gray-300 bg-opacity-20 backdrop-blur-md p-4 flex flex-col shadow-inner">
        <motion.button
          whileHover={{scale: 1.1}}
          whileTop={{scale: 0.9}}
          onClick={()=> setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors max-w-fit"
        >
          <Menu size={20} />
        </motion.button>
        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href} onClick={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-300 hover:bg-opacity-50 transition-colors mb-2">
                <item.icon className="flex items-center justify-center min-w-[20px]" size={20} style={{color: item.color}}/>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap text-black"
                      initial={{opacity: 0, width:0}}
                      animate={{opacity: 1, width:"auto"}}
                      exit={{opacity: 0, width:0}}
                      transition={{duration: 0.2, delay: 0.35}}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  )
}

export default Sidebar