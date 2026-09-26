import { api } from './api.js';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/jwt.js';
import 'dotenv/config';

let tokenEmCache = null

export function gerarToken(usuario) {
    return jwt.sign(
        { role: usuario.role, nome: usuario.nome },
        JWT_SECRET,
        { subject: String(usuario.id), expiresIn: JWT_EXPIRES_IN }
    );
}

export function validarToken(token) {
    return jwt.verify(token, JWT_SECRET);
}

/**
 * Faz o login como Administrador usando as credenciais do .env.
 * Possui um sistema de cache: o login na API só é feito na primeira vez que for chamado.
 * Nas chamadas seguintes, reaproveita o token guardado na variável 'tokenEmCache' para deixar os testes mais rápidos.
 * Retorna o token já formatado com "Bearer " na frente, pronto para o cabeçalho de Authorization.
 */
export async function comTokenDeAdmin() {
    if (!tokenEmCache) {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({ 
                    email: process.env.ADMIN_EMAIL, 
                    senha: process.env.ADMIN_SENHA
            });
        
        tokenEmCache = loginResposta.body.token;
    }

    return `Bearer ${tokenEmCache}`;
}

/**
 * Função genérica para realizar o login de qualquer usuário (como um Aluno).
 * Recebe o e-mail e senha por parâmetro e sempre faz uma nova requisição na API (sem cache).
 * Retorna apenas o texto puro do token.
 */
export async function getToken(emailUser, passUser) {
    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({ 
            email: emailUser, 
            senha: passUser
        });

    return loginResposta.body.token;
}

/**
 * Helper que encapsula a chamada do 'getToken' para os alunos.
 * Além de obter o token bruto da função acima, já formata a string retornando com o prefixo "Bearer ",
 * mantendo o comportamento idêntico ao do Admin para padronizar e facilitar a escrita dos testes.
 */
export async function comTokenDeUsuario(emailUser, passUser) {
    const token = await getToken(emailUser, passUser);
    return `Bearer ${token}`;
}