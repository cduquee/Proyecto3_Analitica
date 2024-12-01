import React, { useState, useEffect} from 'react';
import { Upload } from "lucide-react";
import "../../index.css"; 
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import ImageSaber from '../../assets/img/saber11.png';

const Form = ({ formData, setFormData , success, setSuccess}) => {
  const [inputValue, setInputValue] = useState("--");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [uniqueValues, setUniqueValues] = useState({});
  
  const MemoizedDropdown = React.memo(({ column, value, onChange }) => (
    
    <div key={column.name} className='mb-4'>
      <label className="block text-sm font-medium text-gray-700 mb-2">{column.name}</label>
      <select
        className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={value}
        onChange={onChange}
      >
        <option value="">Selecione una Opción</option>
        {Object.keys(column.options).sort().map((optionKey, index) => (
          <option key={index} value={column.options[optionKey]}>
            {optionKey}
          </option>
        ))}
      </select>
    </div>
  ));

  MemoizedDropdown.displayName = 'MemoizedDropdown';
  
  MemoizedDropdown.propTypes = {
    column: PropTypes.object.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };
  
  const filteredColumns = Object.entries(uniqueValues)
    .filter(([columnKey, column]) => columnKey.toLowerCase().includes('cole'))  
    .reduce((acc, [columnKey, column]) => {
      acc[columnKey] = {
        name: column.name,
        options: column.options
      };
      return acc;
    }, {});

  const [selectedValues, setSelectedValues] = useState(() => {
    const initialValues = {};
    Object.keys(filteredColumns).forEach((columnKey) => {
      // Initialize selected values with the first option of each column, or `null` if no options
      const column = filteredColumns[columnKey];
      initialValues[columnKey] = Object.keys(column.options)[0] || null; // Default to first option or null
    });
    return initialValues;
  });

  const DataDropdowns = () => {
    
    const handleChange = (columnKey, event) => {
      setSelectedValues((prev) => ({
        ...prev,
        [columnKey]: event.target.value,
      }));

    };
  
    return (
      <div className="grid grid-cols-2 gap-4">        
        {Object.entries(filteredColumns).map(([columnKey, column]) => {
          return (
            <MemoizedDropdown
              key={`${columnKey}-${selectedValues[columnKey]}`} // Unique key by combining columnKey and selected option
              column={column} // Pass the column object to MemoizedDropdown
              value={selectedValues[columnKey]} // Set the selected value for dropdown
              onChange={(e) => handleChange(columnKey, e)} // Update selected value on change
            />
          );
        })}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setSuccess(''); 
    setIsSubmitting(true);


    const sendformData = new FormData();
    /*sendformData.append('name', inputValue);*/
    sendformData.append('file', file);


    Object.entries(selectedValues).forEach(([columnKey, optionValue]) => {
      sendformData.append(columnKey, optionValue);
    });
    
    try {

      const response = await fetch('/api/form-predict', {
        method: 'POST',
        body: sendformData, 
      });

      console.log('Response:', response);
      console.log('Response Status:', response.status);

      if (response.ok) {
        const result = await response.json();
        setSuccess('Formulario enviado!');
        console.log('Parsed Response Result:', result);
        
        setFormData(result); 
      } else {
        setError('Error llenando Formulario.');
      }
    } catch (error) {
      setError('Error en Lectura Archivo. Porfavor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetch('/api/get-options-form')
      .then((response) => response.json())
      .then((data) => {
        setUniqueValues(data);
      })
      .catch((error) => {
        console.error('Error fetching unique values:', error);
      });
  }, []);
  
  
  return (
    <div className='mt-12'>
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
        Estimar Resultados de su Institución Educativa <br />Prueba Saber 11 
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Text input 
        <div className="mb-4">
          <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <input
            id="text-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>*/}

        {/* selecionar */}
        <DataDropdowns uniqueValues={uniqueValues} />
        
        {/* subir archivo */}
        <div className="mb-4 mt-6">
          <label
            htmlFor="file-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Subir archivo con datos estudiantes (.xlsx,.xls,.csv)
          </label>
          <div className="flex items-center">
            {/* input archivo oculto */}
            <input
              id="file-input"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              accept=".xlsx,.xls,.csv"
            />
            {/* boton subir archivo */}
            <label
              htmlFor="file-input"
              className="flex w-full justify-center items-center px-4 py-2  text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
            >
              <Upload className="mr-2" /> 
              Subir Archivo
            </label>
          </div>

          {/* mostrar srchivo seleccionado*/}
          {file && (
            <p className="mt-2 text-sm text-gray-600">Archivo Seleccionado: {file.name}</p>
          )}
        </div>

        {/* boton sumbit */}
        <div className="mb-4">
          <button
            type="submit"
            disabled={isSubmitting} 
            className="w-full text-white p-2 rounded-lg bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
      
      <div className='mt-8'>
        {/* mensaje error */}
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {/* mensaje exito */}
        {success && (
          <Alert severity="success" className="mb-4">
            {success}
          </Alert>
        )}
      </div>
      
      {/* Mostrar datos 
      {formData && (
        <div className="mt-6 p-4 border-t border-gray-300">
          <h3 className="text-xl font-medium text-gray-800">Form Data</h3>
          <p className="text-gray-600 mt-2">Name: {formData['punt_global_prom']}</p>
          <p className="text-gray-600">Selected Option: {console.log(formData)}</p>
        </div>
      )}*/}
      <div className='flex justify-center items-center'>
        <img
          className="object-cover" 
          src={ImageSaber}
          alt="Saber Image"
        />
      </div>
    </div>
  );
};

Form.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
};
export default Form;

