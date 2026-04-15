from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./historico.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Sessao(Base):
    __tablename__ = "sessoes"
    
    id = Column(Integer, primary_key=True, index=True)
    sessao_id = Column(String, unique=True, index=True)
    data = Column(DateTime, default=datetime.now)
    assunto = Column(String)
    nivel = Column(String)
    total_questoes = Column(Integer)
    acertos = Column(Integer)
    nota = Column(Float)

class Questao(Base):
    __tablename__ = "questoes"
    
    id = Column(Integer, primary_key=True, index=True)
    sessao_id = Column(String, index=True)
    pergunta = Column(String)
    resposta_usuario = Column(String)
    resposta_correta = Column(String)
    acertou = Column(Boolean)

Base.metadata.create_all(bind=engine)