import { api } from '../../src/helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin, comTokenDeUsuario } from '../../src/helpers/auth.js';
import entregasData from '../fixtures/entregas.json' with { type: 'json' };
const { testesDeEntregas } = entregasData;

describe('[External]-Fluxo de Entrega de Trabalho', () => {
    testesDeEntregas.forEach(teste => {

        it(teste.testTitle, async () => {
            // Arrange
            // 1. Logar como Admin (ocorre automaticamente ao chamar comTokenDeAdmin)
            const adminToken = await comTokenDeAdmin();
            
            // 2. Cadastrar aluno
            const cadastroAlunoResposta = await api()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send(teste.dadosAluno);
            const alunoId = cadastroAlunoResposta.body.id;

            // 3. Cadastrar disciplina
            const cadastroDisciplinaResposta = await api()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send(teste.dadosDisciplina);
            const disciplinaId = cadastroDisciplinaResposta.body.id;

            // 4. Matricular aluno na disciplina
            await api()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', adminToken)
                .send({
                    alunoId: alunoId
                });

            // Act
            // 5. Logar como o Aluno que acabou de ser criado
            const alunoToken = await comTokenDeUsuario(teste.dadosAluno.email, teste.dadosAluno.senha);

            // 6. Aluno registra a entrega do trabalho
            const entregaResposta = await api()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', alunoToken)
                .send({
                    disciplinaId: disciplinaId,
                    titulo: teste.dadosTrabalho.titulo,
                    descricao: teste.dadosTrabalho.descricao
                });

            // Assert
            expect(entregaResposta.status).to.equal(teste.statusCodeEsperado);
            expect(entregaResposta.body.alunoId).to.equal(alunoId);
            expect(entregaResposta.body.disciplinaId).to.equal(disciplinaId);
            expect(entregaResposta.body.titulo).to.equal(teste.dadosTrabalho.titulo);
            expect(entregaResposta.body.descricao).to.equal(teste.dadosTrabalho.descricao);
        });

    });
});
