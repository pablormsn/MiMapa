import os
import pymongo
from bson.objectid import ObjectId
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from models.marcador import Marcador, MarcadorNew, MarcadorList

load_dotenv()
MONGO_URL = os.getenv("MONGO_URL")

marcadores_bp = APIRouter(prefix="/marcadores", tags=["marcadores"])

client = pymongo.MongoClient(MONGO_URL)
db = client.MiMapa
marcadores = db.marcadores

@marcadores_bp.get("/", response_model=MarcadorList)
def get_marcadores():
    try:
        marcadores_data = list(marcadores.find())
        return MarcadorList(marcadores=marcadores_data)
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al buscar los marcadores: {str(e)}"
        )

@marcadores_bp.get("/{id}", response_model=Marcador)
def get_marcador(id: str):
    try:
        marcador = marcadores.find_one({"_id": ObjectId(id)})
        if not marcador:
            raise HTTPException(status_code=404, detail="Marcador no encontrado")
        return marcador
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al buscar el marcador: {str(e)}"
        )

@marcadores_bp.post("/", response_model=Marcador)
def create_marcador(marcador: MarcadorNew):
    try:
        marcador_data = marcador.to_mongo_dict(exclude_none=True)
        marcador_id = marcadores.insert_one(marcador_data).inserted_id
        return Marcador(**marcadores.find_one({"_id": ObjectId(marcador_id)}))
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al crear el marcador: {str(e)}"
        )

@marcadores_bp.delete("/{id}")
def delete_marcador(id: str):
    try:
        res = marcadores.delete_one({"_id": ObjectId(id)})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Marcador no encontrado")
        return {"message": f"Marcador con ID {id} eliminado"}
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al eliminar el marcador: {str(e)}"
        )