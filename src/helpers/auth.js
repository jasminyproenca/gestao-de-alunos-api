import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/jwt.js';

export function gerarToken(usuario) {
  return jwt.sign({ sub: usuario.id, role: usuario.role, nome: usuario.nome }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function validarToken(token) {
  return jwt.verify(token, JWT_SECRET);
}
