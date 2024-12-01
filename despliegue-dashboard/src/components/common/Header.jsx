
import PropTypes from 'prop-types';

const Header = ({ title }) => {
  return (
    <header className="bg-blue-700 backdrop-blur-md shadow-lg border-b border-gray-700 z-0"
      id='top'
    >
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-100">
          {"Tablero de Datos"}
        </h1>
      </div>
    </header>
  )
}

Header.propTypes ={
  title: PropTypes.string.isRequired,
}

export default Header