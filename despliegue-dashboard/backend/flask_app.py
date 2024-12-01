from flask import Flask, request, jsonify, session
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pandas as pd
import os
import json
import tensorflow.keras as tf
import numpy as np

app = Flask(__name__)
app.secret_key = os.urandom(24)
#app.config['SESSION_COOKIE_DOMAIN'] = '.localhost'
#app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

CORS(app, supports_credentials=True)


with open('./data/Tarea2.py') as file:
    exec(file.read()) 

with open('./data/mapeo.json', 'r', encoding='utf-8') as f:
    mapeo = json.load(f)
    
model = tf.models.load_model("./data/modelo_final.keras")

col = pd.read_csv("./data/datos_limpios.csv").columns.drop(labels=["punt_global"]).values

@app.route('/')
def hello():
    return jsonify({"message": "Data received", "selectedId": "this is dope"})


@app.route('/api/form-predict', methods=['POST'])
def form_predict():
    
    #print(data)
    #result = {"name": "Exito", "selectedOption": "prueba"}
    file = request.files['file']
    filename = file.filename
    session['filename'] = filename
    session.permanent = True
    file.save(f'./uploads/{file.filename}')

    #print("Session after file upload:", session)

    form_data = request.form.to_dict()

    file_extension = file.filename.split('.')[-1].lower()
    print(file_extension, flush=True)
    if file_extension == 'csv':
        dta_pred = pd.read_csv(f'./uploads/{filename}')
    elif file_extension in ['xls', 'xlsx']:
        dta_pred = pd.read_excel(f'./uploads/{filename}')
    else:
        raise ValueError("Formato Incorrecto")
    
    df_form = pd.DataFrame([form_data])
    df_estu =pd.DataFrame(np.repeat(df_form.values, dta_pred.shape[0], axis=0), columns=df_form.columns)

    for cols in dta_pred.columns:
        if cols in mapeo:
            if cols == "periodo":
                dta_pred[cols] = scaler.transform(dta_pred[[cols]])
            else:
                dta_pred[cols] = dta_pred[cols].map(mapeo[cols]['options'])

    dta_pred = pd.DataFrame(pd.concat([dta_pred, df_estu], axis=1)).astype(int)
    dta_pred = dta_pred.loc[:,np.array(col)]
    #print(dta_pred, flush=True)
    res = model.predict(dta_pred)
    #print(res, flush=True)

    return jsonify({"punt_global_prom": float(res.mean())})


@app.route('/api/get-options-form', methods=['GET'])
def get_options_form():
    with open('data/mapeo.json', 'r', encoding='utf-8') as file:
        dta_opt = json.load(file)
    return jsonify(dta_opt)

@app.route('/api/data-estudiantes', methods=['GET'])
def get_data():
    #filename = session.get('filename')
    #print("Session 3 after file upload:", session, flush=True)
    dta_es = pd.read_csv(f"./uploads/data_colegio.csv")
    dta_es = pd.DataFrame(dta_es)
    dta_cole = pd.read_csv(f"./data/data_total_cole.csv")
    dta_cole = pd.DataFrame(dta_cole)
    dta_json_parse = dta_es.apply(lambda x: x.value_counts().to_dict()).to_dict()

    res_dict = {}
    for column in dta_es.columns:
        if column != 'punt_global':  
            result = dta_es.groupby(column)['punt_global'].agg(
                min='min',
                q1=lambda x: x.quantile(0.25),
                median='median',
                q3=lambda x: x.quantile(0.75),
                max='max'
            )
            
            res_dict[column] = {
                value: stats[['min', 'q1', 'median', 'q3', 'max']].values.flatten().tolist()
                for value, stats in result.groupby(level=0)
            }
    
    res_cole_dict = {}
    for column in dta_cole.columns:
        if column != 'punt_global':  
            result = dta_cole.groupby(column)['punt_global'].agg(
                min='min',
                q1=lambda x: x.quantile(0.25),
                median='median',
                q3=lambda x: x.quantile(0.75),
                max='max'
            )
            
            res_cole_dict[column] = {
                value: stats[['min', 'q1', 'median', 'q3', 'max']].values.flatten().tolist()
                for value, stats in result.groupby(level=0)
            }

    res = {'bar': dta_json_parse, 'cole_dta_box': res_dict, 'todo_dta_box': res_cole_dict}

    return res
if __name__ == '__main__':
    app.run(debug=True)
