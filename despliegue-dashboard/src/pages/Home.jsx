import ImageSaber from '../assets/img/saber11.png';

function Home() {
  return (
    <div className="flex overflow-hidden relative z-10 bg-blue-700 items-center justify-center min-h-screen w-full">
      <div className='flex-1 overflow-hidden relative z-10 bg-white m-10 rounded-xl max-w-lg p-10 text-center shadow-lg shadow-blue-900'>
        <div className='bg-blue-700 py-1 px-6 inline-block rounded-full mb-4'>
          <p className="text-2xl font-bold mb-2 text-white">Proyecto 3: Saber 11</p>
        </div>

        <div className='flex justify-center items-center'>
          <img
            className="object-cover mb-4" 
            src={ImageSaber}
            alt="Saber Image"
          />
        </div>
       
        {/* Information Section */}
        <div className="text-center text-black">

          <p className="text-xl font-bold mb-2">Universidad de los Andes</p>

          <p className="text-md font-semibold mb-6">Análitica Computacional para la <br/> Toma de Decisiones IIND-4130</p>

          <p className="text-md mb-8">
            Camilo Duque - 202024289 <br/>
            Laura Calderón - 202122045 <br/>
            Daniela Espinosa - 202022615

          </p>
          <a
            href="/dashboard"
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Dashboard
          </a>
        </div>
      </div>
    </div>
  )
}

export default Home