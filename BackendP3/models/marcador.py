from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from pydantic_mongo import PydanticObjectId
from models.baseMongo import MongoBase

class Marcador(BaseModel, MongoBase):
    id: PydanticObjectId = Field(alias="_id")
    email: EmailStr
    lat: str
    lon: str

class MarcadorNew(BaseModel, MongoBase):
    email: EmailStr
    lat: str
    lon: str

class MarcadorList(BaseModel):
    marcadores: List[Marcador]