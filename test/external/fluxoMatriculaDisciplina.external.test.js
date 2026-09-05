import request from 'supertest';
import { expect } from 'chai';
import 'dotenv/config'

describe('Matrícula de Aluno em Disciplina', () => {
    // ANTES DE RODAR ESSE IT:
    // - Tenha o email admin@escola.com e a senha admin123 cadastrados no banco
    // - Não ter no banco de dados uma aluna com email ana.souza.1004@example.com e a matricula 202401004
    // - Não ter uma disciplina com o código PC1004
    it.only('Validar que um aluno que acaba de ser cadastrado pode ser matriculado em uma nova disciplina', async () => {
        // Arrange (Given/Dado que/Preparar)
        // Fazer login, Cadastrar o aluno e cadastrar a disciplina
        const loginResposta = await request(process.env.BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                email:process.env.ADMIN_EMAIL, 
                senha:process.env.ADMIN_SENHA
            });
                
        const tokenAdmin = loginResposta.body.token;

        const cadastroAlunoResposta = await request(process.env.BASE_URL)
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nome: 'Ana Souza',
                email: 'ana.souza.1004@example.com',
                matricula: '202401004',
                senha: '123456'
            });
                
        const alunoId = cadastroAlunoResposta.body.id;
        
        const cadastroDisciplinaResposta = await request(process.env.BASE_URL)
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nome: 'Pensamento Computacional',
                codigo: 'PC1004',
                cargaHoraria: 60
            });
                
        const disciplinaId = cadastroDisciplinaResposta.body.id;

        // Act (When/Quando/Agir/Executar)
        // Matricular o aluno
        const cadastroMatriculaResposta = await request(process.env.BASE_URL)
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                alunoId: alunoId
            });

        // Assert (Then/Então/Validar)
        // Validar que o aluno de fato foi matriculado na disciplina
        expect(cadastroMatriculaResposta.status).to.equal(201);
        expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
        expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
    })
});