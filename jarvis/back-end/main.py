from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime
from database import SessionLocal, Sessao, Questao
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestaoData(BaseModel):
    pergunta: str
    resposta_usuario: str
    resposta_correta: str
    acertou: bool

class SessaoData(BaseModel):
    assunto: str
    nivel: str
    total_questoes: int
    acertos: int
    nota: float
    questoes: List[QuestaoData]

@app.post("/api/salvar-sessao")
async def salvar_sessao(sessao_data: SessaoData):
    db = SessionLocal()
    try:
        sessao_id = str(uuid.uuid4())
        
        db_sessao = Sessao(
            sessao_id=sessao_id,
            data=datetime.now(),
            assunto=sessao_data.assunto,
            nivel=sessao_data.nivel,
            total_questoes=sessao_data.total_questoes,
            acertos=sessao_data.acertos,
            nota=sessao_data.nota
        )
        db.add(db_sessao)
        
        for q in sessao_data.questoes:
            db_questao = Questao(
                sessao_id=sessao_id,
                pergunta=q.pergunta,
                resposta_usuario=q.resposta_usuario,
                resposta_correta=q.resposta_correta,
                acertou=q.acertou
            )
            db.add(db_questao)
        
        db.commit()
        return {"success": True, "sessao_id": sessao_id}
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e)) 
    finally:
        db.close()

@app.get("/api/historico")
async def get_historico():
    db = SessionLocal()
    try:
        sessoes = db.query(Sessao).order_by(Sessao.data.desc()).limit(50).all()
        return [
            {
                "id": s.sessao_id,
                "data": s.data.strftime("%d/%m/%Y"),
                "assunto": s.assunto,
                "nivel": s.nivel,
                "total_questoes": s.total_questoes,
                "acertos": s.acertos,
                "nota": s.nota
            }
            for s in sessoes
        ]
    finally:
        db.close()

@app.get("/api/sessao/{sessao_id}")
async def get_sessao(sessao_id: str):
    db = SessionLocal()
    try:
        sessao = db.query(Sessao).filter(Sessao.sessao_id == sessao_id).first()
        if not sessao:
            raise HTTPException(status_code=404, detail="Sessão não encontrada")
        
        questoes = db.query(Questao).filter(Questao.sessao_id == sessao_id).all()
        
        return {
            "id": sessao.sessao_id,
            "data": sessao.data.strftime("%d/%m/%Y"),
            "assunto": sessao.assunto,
            "nivel": sessao.nivel,
            "total_questoes": sessao.total_questoes,
            "acertos": sessao.acertos,
            "nota": sessao.nota,
            "questoes": [
                {
                    "pergunta": q.pergunta,
                    "resposta_usuario": q.resposta_usuario,
                    "resposta_correta": q.resposta_correta,
                    "acertou": q.acertou
                }
                for q in questoes
            ]
        }
    finally:
        db.close()

@app.get("/api/estatisticas")
async def get_estatisticas():
    db = SessionLocal()
    try:
        total_sessoes = db.query(Sessao).count()
        
        from sqlalchemy import func
        stats = db.query(
            func.sum(Sessao.total_questoes).label("total_questoes"),
            func.sum(Sessao.acertos).label("total_acertos"),
            func.avg(Sessao.nota).label("media_geral")
        ).first()
        
        assunto_result = db.query(
            Sessao.assunto, 
            func.count(Sessao.id).label("total")
        ).group_by(Sessao.assunto).order_by(func.count(Sessao.id).desc()).first()
        
        return {
            "total_sessoes": total_sessoes,
            "total_questoes": stats.total_questoes or 0,
            "total_acertos": stats.total_acertos or 0,
            "media_geral": round(stats.media_geral or 0, 1),
            "assunto_mais_estudado": assunto_result[0] if assunto_result else "Nenhum"
        }
    finally:
        db.close()

@app.delete("/api/limpar-historico")
async def limpar_historico():
    db = SessionLocal()
    try:
        db.query(Questao).delete()
        db.query(Sessao).delete()
        db.commit()
        return {"success": True}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)