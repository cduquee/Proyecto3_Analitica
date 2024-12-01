#!/usr/bin/env python
# coding: utf-8

# <style>
#     h1 {
#     font-family: 'Segoe UI Semibold';
#     font-size: 50px;
#     text-align: center;
#   }
# </style>
# 
# # PROYECTO 3: Saber 11

# <style>
#   .image {
#             overflow: hidden;
#             width: 100%;
#             border-radius: 20px;
#             object-fit: cover;
#         }
#   .container {
#             width: 100%;
#             height: 300px;
#         }
# 
# </style>
# 
# <div class="container">
#     <img src="../img/image.png" class="image"/>
# </div>

# <style>
#   p {
#     font-family: 'Segoe UI Light';
#     font-size: 20px;
#     text-align: center;
#   }
# </style>
# 
# <div style="text-align: center;">
#   Analítica Computacional para la Toma de Decisiones IIND-4130 <br>
#   Universidad de los Andes &copy; 2024 <br>
#   19 de noviembre de 2024 <br><br>
#   <strong>GRUPO 7:</strong> <br>
#   Laura Calderón - 202122045 <br>
#   Camilo Duque - 202024289<br>
#   Daniela Espinosa - 202022615<br>
# </div>
# 

# ## **Tarea 2**
# Limpieza de Datos

# ### **Proceso de Limpieza Previo en AWS Athena**
# 
# A continuación, se describe el proceso de limpieza y preparación realizado en AWS Athena para la obtención de una tabla depurada que será utilizada en el análisis:
# 
# 1. **Filtrado por Departamento:**
#    - Se seleccionaron únicamente los registros correspondientes a colegios ubicados en el departamento de **Boyacá**, filtrando la tabla según el campo `cole_depto_ubicacion`.
# 
# 2. **Eliminación de Registros Duplicados:**
#    - Se utilizó la cláusula `DISTINCT` para eliminar registros duplicados de la tabla, asegurando que cada fila representara datos únicos.
# 
# 3. **Manejo de Datos Faltantes:**
#    - Se observó que para los datos correspondientes a los periodos entre `20101` y `20141`, no se disponía de registros sobre los puntajes obtenidos por los estudiantes en las pruebas ICFES. Esto representaba un **43% de datos faltantes** en las columnas relacionadas con los puntajes.
#    - Dado que estos registros no aportaban valor al análisis, se decidió **eliminarlos**. Por lo tanto, el estudio se enfoca únicamente en datos desde el periodo `20142` en adelante.
# 
# 4. **Eliminación de Columnas Redundantes o Poco Informativas:**
#    - **`cole_cod_depto_ubicacion`:** Representa únicamente el identificador del departamento (15 para Boyacá). Dado que todos los registros pertenecen al mismo departamento, esta columna se eliminó.
#    - **`estu_consecutivo`:** Se verificó que este campo, utilizado como identificador único del estudiante, no tuviera valores duplicados. Tras confirmar su unicidad, se eliminó al no ser relevante para el análisis.
#    - **`cole_depto_ubicacion`:** Esta columna también se eliminó, ya que toda la tabla corresponde al departamento de Boyacá y, por ende, no añade información adicional.
#    - **`cole_cod_mcpio_ubicacion`:** Este campo numérico representaba el municipio del colegio. Sin embargo, su información es redundante con la columna `cole_mcpio_ubicacion`, que contiene el nombre del municipio. Por lo tanto, se eliminó.
#    - **`estu_cod_depto_presentacion` y `estu_cod_mcpio_presentacion`:** Ambas columnas contienen códigos numéricos que representan los departamentos y municipios de presentación del estudiante, pero la misma información ya está disponible en `estu_depto_presentacion` y `estu_mcpio_presentacion`. Por esta razón, se eliminaron.
#    - **`estu_cod_reside_depto` y `estu_cod_reside_mcpio`:** Similar a los casos anteriores, estas columnas contienen códigos de los departamentos y municipios de residencia, pero la misma información ya está en `estu_depto_reside` y `estu_mcpio_reside`. Se procedió a eliminarlas.
#    - **`cole_cod_dane_establecimiento` y `cole_cod_dane_sede`:** Estas columnas contienen identificadores únicos de los colegios y sedes, pero no aportan valor al análisis y, por ende, se eliminaron.
# 
# 5. **Resultado Final:**
#    - El resultado del proceso es una tabla depurada en AWS Athena. Esta tabla se exportó en formato CSV y será utilizada para continuar con el proceso de limpieza y análisis en este notebook.
# 

# <style>
#   .image {
#             overflow: hidden;
#             width: 100%;
#             border-radius: 20px;
#             object-fit: cover;
#         }
#   .container {
#             width: 100%;
#             height: 750px;
#         }
# 
# </style>
# 
# <div class="container">
#     <img src="../img/Consulta_Final.png" class="image"/>
# </div>

# In[20]:


import pandas as pd
from sklearn.preprocessing import LabelEncoder
import pandas as pd
from scipy.stats import zscore
from sklearn.preprocessing import OneHotEncoder

dta = pd.read_csv('./data/Datos_Boyaca.csv')

# Mostrar información básica del DataFrame
print(f"Total de registros: {dta.shape[0]}")
print(f"Total de columnas: {dta.shape[1]}")

# Mostrar un resumen de las columnas
print("\nResumen de columnas:")
print(dta.info())


# In[21]:


# Verificar que no haya filas duplicadas
duplicados = dta.duplicated()

# Contar cuántas filas duplicadas hay
num_duplicados = duplicados.sum()
print(f"Número de filas duplicadas: {num_duplicados}")


# In[22]:


# Calcular la cantidad de valores faltantes y el porcentaje
faltantes = dta.isnull().sum()
porcentaje_faltantes = (dta.isnull().sum() / len(dta)) * 100

resumen_faltantes = pd.DataFrame({
    'Valores Faltantes': faltantes,
    'Porcentaje (%)': porcentaje_faltantes
})

# Filtrar para mostrar solo las columnas con valores faltantes
resumen_faltantes = resumen_faltantes[resumen_faltantes['Valores Faltantes'] > 0]
resumen_faltantes = resumen_faltantes.sort_values(by='Porcentaje (%)', ascending=False)

print(resumen_faltantes)


# In[23]:


# Crear un diccionario para almacenar la proporción máxima y el valor más repetido por columna
columnas_dominantes = {}

for columna in dta.columns:
    valor_mas_comun = dta[columna].value_counts(normalize=True, dropna=False).idxmax()
    proporcion_max = dta[columna].value_counts(normalize=True, dropna=False).max()
    columnas_dominantes[columna] = {'Proporción Max (%)': proporcion_max * 100, 'Valor Más Común': valor_mas_comun}

resultado = pd.DataFrame.from_dict(columnas_dominantes, orient='index')
columnas_repetitivas = resultado[resultado['Proporción Max (%)'] >= 95]
columnas_repetitivas = columnas_repetitivas.sort_values(by='Proporción Max (%)', ascending=False)

print("Columnas con 95% o más de valores repetidos:")
print(columnas_repetitivas)


# In[24]:


# Identificar columnas con más del 95% de valores repetidos y eliminnarlas
columnas_a_eliminar = columnas_repetitivas.index.tolist()
dta= dta.drop(columns=columnas_a_eliminar)


# In[25]:


# Identificar columnas numéricas en el DataFrame
columnas_numericas = dta.select_dtypes(include=['number']).columns
print("Columnas numéricas:")
print(columnas_numericas)

if len(columnas_numericas) == 0:
    print("No hay columnas numéricas en el DataFrame.")
else:
    print(f"Total de columnas numéricas: {len(columnas_numericas)}")


# In[26]:


# Identificar las columnas categóricas y las columnas numéricas con faltantes
columnas_categoricas = [
    'cole_bilingue', 'fami_estratovivienda', 'fami_tieneinternet', 
    'fami_educacionmadre', 'fami_educacionpadre', 'fami_tieneautomovil',
    'fami_tienelavadora', 'fami_tienecomputador', 'cole_caracter', 
    'estu_genero','fami_personashogar', 'fami_cuartoshogar','desemp_ingles','estu_cod_reside_mcpio','estu_mcpio_reside'
]

columnas_numericas_faltantes = [
    'punt_ingles', 'punt_global'
]

print("\nSe imputaan valores faltante en columnas categóricas con la moda:")
# Imputar valores faltantes en columnas categóricas con la moda
for col in columnas_categoricas:
    if col in dta.columns:
        moda = dta[col].mode()[0]
        dta[col] = dta[col].fillna(moda)
        print(f" '{col}':  {moda}")

print("\nSe imputaan valores faltante en columnas numéricas con la media:")
# Imputar valores faltantes en columnas numéricas con la media
for col in columnas_numericas_faltantes:
    if col in dta.columns:
        media = dta[col].mean()
        dta[col] = dta[col].fillna(media)
        print(f" '{col}': {media}")

# Verificar que no queden valores faltantes
faltantes_restantes = dta.isnull().sum()
print("\nValores faltantes restantes por columna después de la imputación:")
print(faltantes_restantes[faltantes_restantes > 0])


# ### **Limpieza Final de acuerdo a las preguntas de negocio y al plan de acción**
# 
# #### **1. ¿Cuáles factores sociodemográficos están más relacionados con el mal desempeño de los estudiantes de colegios de Boyacá en la prueba Saber 11?**
# **Columnas relevantes:**
# - `fami_estratovivienda` (estrato socioeconómico).
# - `fami_educacionmadre` y `fami_educacionpadre` (nivel educativo de los padres).
# - `fami_tieneinternet`, `fami_tienecomputador`, `fami_tienelavadora`, `fami_tieneautomovil` (accesos familiares).
# - `estu_genero` (género).
# - `estu_mcpio_reside` (municipio de residencia).
# - `fami_personashogar` y `fami_cuartoshogar` (tamaño del hogar).
# - **`periodo`** (para analizar si hay tendencias en el tiempo relacionadas con los factores sociodemográficos).
# 
# ---
# 
# #### **2. ¿¿Qué cambios pueden implementar los directivos de las instituciones educativas en Boyacá para aumentar el puntaje global del colegio en la Prueba Saber 11? ?**
# **Columnas relevantes:**
# - `cole_area_ubicacion` (rural o urbano).
# - `cole_bilingue` (si es bilingüe).
# - `cole_caracter` (público/privado).
# - `cole_naturaleza` (carácter académico o técnico).
# - `cole_jornada` (jornada escolar).
# - **`periodo`** (para evaluar si el impacto de estas características ha cambiado en diferentes periodos).
# 
# ---
# 
#   
# ### **Columnas Eliminadas y Justificación**
# 
# 1. **Columnas relacionadas con identificadores o información redundante:**
#    - `estu_tipodocumento`, `cole_codigo_icfes`, `cole_nombre_establecimiento`, `cole_nombre_sede`, `cole_sede_principal`:
#      - Estas columnas contienen información de identificación o etiquetas de colegios y estudiantes que no aportan al análisis del desempeño ni a las preguntas planteadas.
# 
# 2. **Columnas relacionadas con localización no utilizadas:**
#    - `cole_mcpio_ubicacion`, `estu_mcpio_presentacion`:
#      - Si bien podrían ser útiles en otros contextos, estas columnas no se alinean directamente con las preguntas seleccionadas. Se priorizó `estu_mcpio_reside` como la variable clave para analizar la ubicación de residencia.
# 
# 3. **Puntajes específicos de áreas (redundantes)::**
#    - `punt_ingles`, `punt_matematicas`,`punt_ingles`, `punt_sociales_ciudadanas`,`punt_c_naturales`,`punt_lectura_critica`:
#      - Estos ya están reflejados en punt_global, que es la suma ponderada de estas áreas. Dado que el puntaje global es la variable objetivo, los puntajes específicos se pueden omitir.
#   
# 

# In[27]:


# Lista de columnas a eliminar
columnas_a_eliminar = [
    'estu_tipodocumento',
    'cole_codigo_icfes' ,'cole_nombre_sede','estu_fechanacimiento',
    'cole_sede_principal', 'cole_mcpio_ubicacion', 'estu_mcpio_presentacion','punt_ingles', 'desemp_ingles','punt_matematicas','punt_ingles', 'punt_sociales_ciudadanas','punt_c_naturales','punt_lectura_critica'
]

# Eliminar las columnas seleccionadas
dta = dta.drop(columns=columnas_a_eliminar, errors='ignore')
dta_cp = dta.copy()
dta = dta.drop(columns='cole_nombre_establecimiento')

# In[28]:


# Mostrar información básica del DataFrame
print(f"Total de registros: {dta.shape[0]}")
print(f"Total de columnas: {dta.shape[1]}")

print(dta.info())

# In[31]:
from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()
dta[['periodo']] = scaler.fit_transform(dta[['periodo']])

