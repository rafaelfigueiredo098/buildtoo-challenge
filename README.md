# Buildtoo Meeting Manager

Aplicação desenvolvida para o desafio técnico da Buildtoo.

O objetivo foi criar uma aplicação simples para gestão de reuniões, onde é possível consultar utilizadores, criar reuniões, convidar participantes e aceitar ou recusar convites.

Dada a minha pouca experiência com estas tecnologias, utilizei ferramentas de IA como apoio durante o desenvolvimento.

## Tecnologias utilizadas

### Front-end
- React
- Vite
- CSS

### Back-end
- Node.js
- Express
- MongoDB
- Mongoose

## Como executar

### Back-end
Na pasta do projeto:
```bash
cd backend
npm install
```

Criar um ficheiro `.env` dentro da pasta `backend` com:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

Para adicionar alguns utilizadores de exemplo à base de dados:
```bash
npm run seed
```

Iniciar o servidor:
```bash
npm run dev
```

O back-end fica disponível em:
```text
http://localhost:3000
```

### Front-end
Num segundo terminal:
```bash
cd frontend
npm install
npm run dev
```

A aplicação fica disponível em:
```text
http://localhost:5173
```

## Decisões técnicas

### Autenticação
Optei por simular o utilizador autenticado, uma vez que a autenticação não era o foco principal do exercício.

Adicionei um dropdown para selecionar o utilizador pretendido de forma a testar a aplicação facilmente com diferentes utilizadores, nomeadamente a aceitação/recusa de convites e a validação de erro caso o utilizador aceite uma meeting sobreposta.

### Data e hora das reuniões
No front-end, a data e a hora são introduzidas separadamente. No back-end são guardadas num único campo `startAt`, o que simplifica a comparação dos horários das reuniões.

Tal como indicado no enunciado, considerei que todas as reuniões têm a duração de uma hora.

### Estados dos convites
Cada participante pode ter um dos seguintes estados:
- `pending`
- `accepted`
- `declined`

Quando uma reunião é criada, os participantes começam com o estado `pending`. Cada utilizador deve posteriormente aceitar/ recusar a reunião.

### Conflitos entre reuniões
Um utilizador pode receber vários convites para reuniões no mesmo horário, mas não pode aceitar uma reunião se já tiver outra reunião aceite que se sobreponha a esse horário.

Optei por fazer esta validação no back-end, uma vez que se trata de uma regra de negócio e não deve depender apenas do front-end.

Caso exista um conflito, a API devolve `409 Conflict`, é mostrado um erro ao utilizador, e o convite mantém o estado anterior.

### Estrutura
Mantive o front-end e o back-end separados.

No back-end separei os modelos e as rotas. Como se trata de uma aplicação pequena e o tempo disponível para o desafio era limitado, optei por manter a restante estrutura simples.

Numa aplicação de maior dimensão, faria sentido separar melhor a lógica de negócio em controllers e services.

## Assunções
Durante o desenvolvimento considerei que:

- todas as reuniões têm a duração de uma hora;
- o utilizador autenticado é simulado;
- o organizador não necessita de receber um convite para a própria reunião;
- todos os convites começam com o estado `pending`;
- podem existir convites sobrepostos, sendo o conflito validado e a mensagem de erro mostrada apenas quando o utilizador tenta aceitar o convite.

## Testes realizados
Foram realizados testes manuais aos principais fluxos da aplicação, com especial atenção à regra de conflito entre reuniões.

Para validar esta regra, foi testado o seguinte cenário:

1. criação de uma reunião com um utilizador como participante;
2. aceitação do convite por esse utilizador;
3. criação de uma segunda reunião, com horário sobreposto, convidando o mesmo utilizador;
4. tentativa de aceitação do segundo convite.

Neste cenário, a aplicação impede que o utilizador aceite a segunda reunião e mantém o convite pendente, uma vez que o utilizador já possui uma reunião aceite nesse período.

Foram também testados os fluxos de criação de reuniões e de aceitação e recusa de convites.

## Se tivesse mais tempo
Com mais tempo, os próximos pontos que abordaria seriam:

- adicionar testes automatizados, principalmente para a validação de conflitos entre reuniões;
- melhorar a validação dos dados recebidos pela API;
- validar melhor o tratamento das datas e fusos horários;
- implementar autenticação real e mecanismos de autorização.

## Nota final
Tendo em conta o tempo sugerido para o desafio, procurei manter a solução simples e focar-me nas funcionalidades principais e na regra de negócio relativa aos conflitos entre reuniões.