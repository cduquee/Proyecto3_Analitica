import { Users, MapPin, GraduationCap, Calendar} from "lucide-react"
import Card from "../components/common/Card"
import Header from "../components/common/Header"
import { motion } from "framer-motion"
import '../index.css'
import Sidebar from "../components/Sidebar"
import { useState, useEffect } from "react"
import Form from "../components/common/Form"
import BarChart from '../components/common/BarChart';
import BoxPlotChart from "../components/common/BoxPlot"
import AreaChart from "../components/common/AreaChart"

const procesarvalue = (value) => {
  return typeof value === 'number' ? Math.round(value) : value;
};
const Dashboard = () => {
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({"punt_global_prom":"---"});
  const punt_global_prom = formData['punt_global_prom'];
  const [databoxcole, setDataBoxcole] = useState(null);
  const [databoxtodo, setDataBoxtodo] = useState(null);

  const [databar, setDataBar] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (success) { 
      fetch('/api/data-estudiantes', {
        method: 'GET',
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((data) => {
          setDataBoxcole(data.cole_dta_box)
          setDataBoxtodo(data.todo_dta_box)
          setDataBar(data.bar)
        }) 
        .catch((error) => setError(error)); 
    }
  }, [success]);

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto relative z-10">
        <Header title="Dashboard"/>
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 1}}
          >
            <Card name= "Puntaje Global Promedio" icon={GraduationCap} value={procesarvalue(punt_global_prom)} color="var(--color-primary)"/>
            <Card name= "Num. Estudiantes" icon={Users} value={databar ? Object.values(databar['periodo']) : '---'} color="var(--color-secondary)"/>
            <Card name= "Municipio" icon={MapPin} value={databar ? Object.keys(databar['estu_mcpio_reside']) : '---'} color="var(--color-green)"/>
            <Card name= "Periodo" icon={Calendar} value= {databar ? Object.keys(databar['periodo']) : '---'} color="var(--color-light-blue)"/>
          </motion.div>

          <div className="grid grid-cols-3 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-4">
            <div className="col-span-full sm:col-span-2 lg:col-span-2 xl:col-span-2 flex flex-col items-center justify-center">
              <div className="flex-1 bg-white p-6 text-black rounded-xl shadow-lg items-center justify-center">
                <Form formData={formData} setFormData={setFormData} success={success} setSuccess={setSuccess} />
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-5">
              <div className="flex-1 bg-white p-6 text-black rounded-xl shadow-lg">
                <BarChart titulo="Estrato Familia" dataKey="fami_estratovivienda" data={databar} />
              </div>
              <div className="flex-1 bg-white p-6 text-black rounded-xl shadow-lg">
                <BoxPlotChart titulo="¿Es Bilingue?" dataKey="cole_bilingue" data={databoxtodo} horiz={true} xtitulo={"Puntaje Global de Boyaca"} ytitulo={"Bilingue"} colortop={"#0345e4"} colorbottom={"#f16721"}/>
              </div>
            </div>
            <div className="bg-white p-6 text-black rounded-xl shadow-lg col-span-full">
              <AreaChart titulo="Educación del Padre"dataKey="fami_educacionpadre" data={databoxcole} xtitulo={"Nivel de Educacion"} ytitulo={"Puntaje Global Estudiantes"}/>
              {/*horiz={false} xtitulo={"Nivel de Educacion"} ytitulo={"Puntaje Global Estudiantes"} colortop={"#0db939"} colorbottom={"#b6e116"}*/}
            </div>
          </div>

        </main>
      </div>
    </>
  )
}

export default Dashboard