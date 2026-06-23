export class ErroAplicacao extends Error {
  constructor(
    mensagem: string,
    public codigo: number
  ) {
    super(mensagem)
    this.name = 'ErroAplicacao'
  }
}

export class ErroNaoEncontrado extends ErroAplicacao {
  constructor(mensagem: string) {
    super(mensagem, 404)
    this.name = 'ErroNaoEncontrado'
  }
}

export class ErroConflito extends ErroAplicacao {
  constructor(mensagem: string) {
    super(mensagem, 409)
    this.name = 'ErroConflito'
  }
}

export class ErroValidacao extends ErroAplicacao {
  constructor(mensagem: string) {
    super(mensagem, 400)
    this.name = 'ErroValidacao'
  }
}

export class ErroNaoAutorizado extends ErroAplicacao {
  constructor(mensagem: string = 'Credenciais inválidas') {
    super(mensagem, 401)
    this.name = 'ErroNaoAutorizado'
  }
}

export class ErroNaoAutenticado extends ErroAplicacao {
  constructor(mensagem: string = 'Token não fornecido ou inválido') {
    super(mensagem, 401)
    this.name = 'ErroNaoAutenticado'
  }
}
