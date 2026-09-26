import { api } from '../../src/helpers/api.js';
import { expect } from 'chai';
import { comTokenDeAdmin } from '../../src/helpers/auth.js';

describe('[External]-Testes de Cadastro de Aluno', () => {
    it('CT01: Deve cadastrar um aluno quando informar dados válidos', async () => {
        // Obter o Token de Admin:
        const token = await comTokenDeAdmin();

        // Cadastrar o Aluno:
        const cadastroAlunoResposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .send({
                nome: 'Marcos Paulo',
                email: 'mpsgarcia@example.com',
                matricula: '2026-0003',
                senha: '123456'
            });

        // Validar que o Aluno foi Cadastrado:
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('Marcos Paulo');
        expect(cadastroAlunoResposta.body.email).to.equal('mpsgarcia@example.com');
        expect(cadastroAlunoResposta.body.matricula).to.equal('2026-0003');

    });

});