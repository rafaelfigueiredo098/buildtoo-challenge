# Buildtoo Meeting Manager
Pequena aplicação full-stack desenvolvida no âmbito do desafio técnico da Buildtoo.

A aplicação permite consultar utilizadores, criar reuniões, convidar participantes, consultar reuniões e gerir os respetivos convites.

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

## Funcionalidades
- Consulta e pesquisa de utilizadores
- Seleção de utilizadores para uma reunião
- Criação de reuniões
- Consulta das reuniões de um utilizador
- Consulta dos participantes e do estado dos convites
- Aceitação e recusa de convites
- Deteção de conflitos entre reuniões aceites
- Estados de loading, ausência de resultados e erro
- Simulação do utilizador autenticado

## Como executar

### Pré-requisitos
É necessário ter instalado:
- Node.js
- npm
- acesso a uma base de dados MongoDB

### Back-end
Na raiz do projeto:
```bash
cd backend
npm install
```

Criar um ficheiro `.env` dentro da pasta `backend`:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```
Para popular a base de dados com os utilizadores de exemplo:
```bash
npm run seed
```

Iniciar o servidor:
```bash
npm run dev
```

A API ficará disponível em:
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

A aplicação ficará disponível em:
```text
http://localhost:5173
```

## Decisões técnicas

### Autenticação
Optei por simular o utilizador autenticado, uma vez que a implementação de autenticação não constitui um dos principais objetivos do exercício.

Foi adicionado um seletor de utilizador na interface. Desta forma, é possível simular diferentes utilizadores e demonstrar facilmente os fluxos de aceitação e recusa de convites sem introduzir complexidade adicional de autenticação.

### Representação da data e hora
Apesar de a interface permitir introduzir a data e a hora de início separadamente, estes valores são armazenados no back-end num único campo `startAt`.

Esta opção simplifica as comparações temporais necessárias para a deteção de conflitos entre reuniões.

De acordo com a indicação do enunciado, assumi que todas as reuniões têm a duração de uma hora.

### Estado dos convites
Cada participante possui um dos seguintes estados:
- `pending`
- `accepted`
- `declined`

O estado do convite é armazenado juntamente com o participante em cada reunião.

### Deteção de conflitos
Um utilizador pode receber vários convites para reuniões que decorram no mesmo período.

No entanto, no momento em que tenta aceitar um convite, o back-end verifica as restantes reuniões já aceites pelo utilizador.

Existe sobreposição quando:
```text
newStart < existingEnd && newEnd > existingStart
```

Caso seja identificado um conflito, a API devolve `409 Conflict` e o convite não é aceite.

Esta regra foi implementada no back-end, em vez de depender apenas da interface, garantindo que a regra de negócio não pode ser contornada pelo cliente.

### Estrutura do projeto
O front-end e o back-end foram mantidos como aplicações separadas.

No back-end, os modelos e as rotas encontram-se separados. Tendo em conta a dimensão e o tempo disponível para o exercício, optei por não introduzir camadas adicionais de abstração.

Numa aplicação de maior dimensão, a lógica de negócio poderia ser extraída para controllers e services dedicados.

## Assunções
Durante a implementação foram consideradas as seguintes assunções:

- todas as reuniões têm a duração de uma hora;
- a autenticação encontra-se fora do âmbito principal do exercício e foi simulada;
- o organizador pertence implicitamente à reunião e não necessita de convite;
- os participantes convidados começam com o estado `pending`;
- um utilizador pode receber um convite para uma reunião que entre em conflito com outra já aceite;
- o conflito apenas impede a aceitação do convite;
- as datas são comunicadas entre o front-end e o back-end através de valores ISO.

## Se tivesse mais tempo...

Os próximos pontos que consideraria seriam:
- adicionar testes automatizados, sobretudo para a regra de conflito entre reuniões;
- melhorar a validação dos dados recebidos pela API;
- separar a lógica de negócio em controllers/services;
- implementar autenticação e autorização;
- melhorar o tratamento de datas e fusos horários;
- tratar possíveis condições de corrida na aceitação simultânea de convites;
- adicionar documentação da API;
- adicionar paginação e filtros;
- melhorar a acessibilidade;
- adicionar testes end-to-end;
- adicionar Docker;
- configurar CI.

## Nota final

A implementação foi intencionalmente mantida simples e focada nos requisitos principais do exercício.

Tendo em conta o tempo sugerido para a realização do desafio, priorizei a implementação dos principais fluxos da aplicação e da regra de negócio associada aos conflitos entre reuniões, em vez de adicionar funcionalidades ou infraestrutura opcionais.