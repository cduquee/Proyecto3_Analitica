
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Card = ({name, icon:Icon, value, color}) => {
  return (
    <motion.div className="bg-gray-300 bg-opacity-20 backdrop-blur-m shadow-lg overflow-hidden rounded-xl border-gray-700"
      whileHover={{y: -2, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)"}}
    >
      <div className="px-4 py-5 sm:p-6">
        <span className="flex items-center text-sm font-medium text-gray-500">
          <Icon 
            size= {20}
            className="mr-2"
            style={{ color }}
          />
          {name}
        </span>
        <p className="mt-1 text-3xl font-semibold" style={{color}}>{value}</p>

      </div>
    </motion.div>
  )
}

Card.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string

}

export default Card