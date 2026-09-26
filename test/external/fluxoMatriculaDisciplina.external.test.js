import { api } from '../../src/helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin } from '../../src/helpers/auth.js';
import { novoAluno } from '../factories/alunosFactores.js';
import { novaDisciplina } from '../factories/disciplinasFactores.js';
import testesDeMatriculas from '../fixtures/matriculas.json' with { type: 'json' };

describe('[External]-Matrícula de Aluno em Disciplina', () => {
    testesDeMatriculas.forEach(testeDeMatricula => {

    it(testeDeMatricula.testTitle, async () => {
        // Arrange (Given/Dado que/Preparar)
        // Cadastrar o aluno e cadastrar a disciplina
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(testeDeMatricula.dadosAluno);
                
        const alunoId = cadastroAlunoResposta.body.id;
        
        const cadastroDisciplinaResposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send(novaDisciplina());
                
        const disciplinaId = cadastroDisciplinaResposta.body.id;

        // Act (When/Quando/Agir/Executar)
        // Matricular o aluno
        const cadastroMatriculaResposta = await api()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await comTokenDeAdmin())
            .send({
                alunoId: alunoId
            });

        // Assert (Then/Então/Validar)
        // Validar que o aluno de fato foi matriculado na disciplina
        expect(cadastroMatriculaResposta.status).to.equal(testeDeMatricula.statusCodeEsperado);
        expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
        expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
        })
    });
});