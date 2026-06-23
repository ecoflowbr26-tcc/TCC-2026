# Guia de Integração: EcoFlow NodeJS + SQL Server 🌿🔌

Este guia instrui como configurar e executar o servidor backend **Node.js + Express** conectado a um banco de dados relacional **Microsoft SQL Server (MSSQL)** para suportar de forma robusta e persistente o portal **EcoFlow**.

O frontend já está configurado com um barramento de API inteligente (`src/services/api.ts`) que consome este servidor assim que configurado na variável de ambiente.

---

## 1. Passo a Passo do Banco de Dados SQL Server 🗄️

Execute o script SQL complementar abaixo no seu gerenciador de banco de dados (ex: *SQL Server Management Studio - SSMS* ou *Azure Data Studio*) para criar as tabelas com a tipagem rigorosamente equivalente às estruturas de dados do EcoFlow.

```sql
-- ==========================================
-- SCRIPT DE CRIAÇÃO DO BANCO ECOFLOW (MSSQL)
-- ==========================================

-- 1. Tabela de Usuários (Vendedores e Administradores)
CREATE TABLE users (
    id NVARCHAR(50) PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(150) UNIQUE NOT NULL,
    avatar NVARCHAR(max) NULL,
    bio NVARCHAR(max) NULL,
    city NVARCHAR(100) NULL,
    state NVARCHAR(10) NULL,
    followersCount INT DEFAULT 0,
    followingCount INT DEFAULT 0,
    postsCount INT DEFAULT 0,
    isCreator BIT DEFAULT 1,
    banner NVARCHAR(max) NULL,
    contactWhatsapp NVARCHAR(30) NULL,
    contactInstagram NVARCHAR(100) NULL,
    contactFacebook NVARCHAR(100) NULL,
    isAdmin BIT DEFAULT 0,
    isInactive BIT DEFAULT 0,
    password_hash NVARCHAR(255) NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE()
);

-- 2. Tabela de Produtos (Anúncios Circulares)
CREATE TABLE products (
    id NVARCHAR(50) PRIMARY KEY,
    title NVARCHAR(200) NOT NULL,
    description NVARCHAR(max) NOT NULL,
    category NVARCHAR(100) NOT NULL,
    material NVARCHAR(100) NOT NULL,
    productType NVARCHAR(100) NOT NULL,
    price DECIMAL(18, 2) NOT NULL,
    images NVARCHAR(max) NOT NULL, -- Lista serializada de URLs ou JSON Array
    creatorId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE,
    creatorName NVARCHAR(100) NOT NULL,
    creatorAvatar NVARCHAR(max) NULL,
    creatorBio NVARCHAR(max) NULL,
    likesCount INT DEFAULT 0,
    interestsCount INT DEFAULT 0,
    city NVARCHAR(100) NOT NULL,
    state NVARCHAR(10) NOT NULL,
    contactWhatsapp NVARCHAR(30) NULL,
    contactInstagram NVARCHAR(100) NULL,
    contactFacebook NVARCHAR(100) NULL,
    isInactive BIT DEFAULT 0,
    isSold BIT DEFAULT 0,
    createdAt DATETIME2 DEFAULT GETDATE(),
    
    -- Propriedades Exclusivas Madeira Sustentável (DTA)
    isPremiumWood BIT DEFAULT 0,
    woodType NVARCHAR(100) NULL,
    woodOrigin NVARCHAR(250) NULL,
    isArtisanal BIT DEFAULT 0,
    dimensions NVARCHAR(100) NULL,
    priceRange NVARCHAR(100) NULL,
    socialPostUrl NVARCHAR(max) NULL
);

-- 3. Tabela de Avaliações / Comentários
CREATE TABLE comments (
    id NVARCHAR(50) PRIMARY KEY,
    productId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
    authorId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES users(id),
    authorName NVARCHAR(100) NOT NULL,
    authorAvatar NVARCHAR(max) NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    text NVARCHAR(max) NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE()
);

-- 4. Tabela Fato: Curtidas (Likes)
CREATE TABLE likes (
    productId NVARCHAR(50) FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
    userId NVARCHAR(50) FOREIGN KEY REFERENCES users(id),
    createdAt DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (productId, userId)
);

-- 5. Tabela Fato: Salvos (Saves)
CREATE TABLE saves (
    productId NVARCHAR(50) FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
    userId NVARCHAR(50) FOREIGN KEY REFERENCES users(id),
    createdAt DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (productId, userId)
);

-- 6. Tabela Fato: Interesses Expressados
CREATE TABLE interests (
    productId NVARCHAR(50) FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
    userId NVARCHAR(50) FOREIGN KEY REFERENCES users(id),
    createdAt DATETIME2 DEFAULT GETDATE(),
    PRIMARY KEY (productId, userId)
);

-- 7. Tabela de Denúncias de Moderação (Suporte Técnico)
CREATE TABLE reports (
    id NVARCHAR(50) PRIMARY KEY,
    productId NVARCHAR(50) NOT NULL FOREIGN KEY REFERENCES products(id) ON DELETE CASCADE,
    productTitle NVARCHAR(200) NOT NULL,
    reason NVARCHAR(max) NOT NULL,
    reporterName NVARCHAR(100) NOT NULL,
    createdAt DATETIME2 DEFAULT GETDATE()
);
```

---

## 2. Estrutura do Servidor NodeJS Exemplo 🚀

Abaixo está o arquivo principal `index.js` utilizando **Express** com o conector oficial do SQL Server para Node (`mssql`).

### Pacotes Necessários:
```bash
npm install express mssql dotenv cors bcryptjs
```

### Arquivo do Servidor (`index.js`):
```javascript
const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Configurações de Conexão com o SQL Server
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // Ex: 'localhost' ou 'meu-servidor.database.windows.net'
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Necessário para Azure SQL / nuvem
        trustServerCertificate: true // Necessário para desenvolvimento local
    }
};

// Conectar ao Banco de Dados
sql.connect(dbConfig)
    .then(pool => {
        console.log('Conectado ao Microsoft SQL Server com sucesso! 🚀');
        app.locals.db = pool;
    })
    .catch(err => {
        console.error('Erro de conexão ao SQL Server:', err);
        process.exit(1);
    });

// 1. Rota de Monitoramento (Healthcheck)
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', database: 'SQL Server' });
});

// 2. Autenticação: Login
app.post('/api/auth/login', async (req, res) => {
    const { email, pass } = req.body;
    try {
        const pool = app.locals.db;
        const result = await pool.request()
            .input('email', sql.NVarChar, email.trim().toLowerCase())
            .query('SELECT * FROM users WHERE email = @email');

        if (result.recordset.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(pass, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        delete user.password_hash; // Remover o hash de segurança antes de enviar ao cliente
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Autenticação: Cadastro
app.post('/api/auth/register', async (req, res) => {
    const { id, name, email, avatar, bio, city, state, banner, contactWhatsapp, contactInstagram, contactFacebook, pass } = req.body;
    try {
        const pool = app.locals.db;
        const passwordHash = await bcrypt.hash(pass, 10);

        await pool.request()
            .input('id', sql.NVarChar, id)
            .input('name', sql.NVarChar, name)
            .input('email', sql.NVarChar, email.toLowerCase().trim())
            .input('avatar', sql.NVarChar, avatar)
            .input('bio', sql.NVarChar, bio || 'Novo criador de impacto na rede EcoFlow! 🌿💚')
            .input('city', sql.NVarChar, city || 'São Paulo')
            .input('state', sql.NVarChar, state || 'SP')
            .input('banner', sql.NVarChar, banner || '')
            .input('contactWhatsapp', sql.NVarChar, contactWhatsapp || '')
            .input('contactInstagram', sql.NVarChar, contactInstagram || '')
            .input('contactFacebook', sql.NVarChar, contactFacebook || '')
            .input('password_hash', sql.NVarChar, passwordHash)
            .query(`
                INSERT INTO users (id, name, email, avatar, bio, city, state, password_hash, banner, contactWhatsapp, contactInstagram, contactFacebook)
                VALUES (@id, @name, @email, @avatar, @bio, @city, @state, @password_hash, @banner, @contactWhatsapp, @contactInstagram, @contactFacebook)
            `);

        res.status(201).json({ user: { id, name, email, avatar, city, state } });
    } catch (err) {
        res.status(400).json({ error: 'O E-mail já está em uso ou dados inconsistentes. Detalhe: ' + err.message });
    }
});

// 4. Obter Produtos Ativos
app.get('/api/products', async (req, res) => {
    try {
        const pool = app.locals.db;
        const productsRes = await pool.request().query('SELECT * FROM products ORDER BY createdAt DESC');
        const commentsRes = await pool.request().query('SELECT * FROM comments');
        
        // Mapeia e junta os comentários aos respectivos anúncios
        const products = productsRes.recordset.map(product => {
            product.images = JSON.parse(product.images); // Converte lista serializada de volta para String Array
            product.comments = commentsRes.recordset.filter(c => c.productId === product.id);
            return product;
        });
        
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Publicar Anúncio de Produto
app.post('/api/products', async (req, res) => {
    const prod = req.body;
    try {
        const pool = app.locals.db;
        await pool.request()
            .input('id', sql.NVarChar, prod.id)
            .input('title', sql.NVarChar, prod.title)
            .input('description', sql.NVarChar, prod.description)
            .input('category', sql.NVarChar, prod.category)
            .input('material', sql.NVarChar, prod.material)
            .input('productType', sql.NVarChar, prod.productType)
            .input('price', sql.Decimal(18, 2), prod.price)
            .input('images', sql.NVarChar, JSON.stringify(prod.images))
            .input('creatorId', sql.NVarChar, prod.creatorId)
            .input('creatorName', sql.NVarChar, prod.creatorName)
            .input('creatorAvatar', sql.NVarChar, prod.creatorAvatar)
            .input('creatorBio', sql.NVarChar, prod.creatorBio)
            .input('city', sql.NVarChar, prod.city)
            .input('state', sql.NVarChar, prod.state)
            .input('contactWhatsapp', sql.NVarChar, prod.contactWhatsapp)
            .input('contactInstagram', sql.NVarChar, prod.contactInstagram)
            .input('contactFacebook', sql.NVarChar, prod.contactFacebook)
            .input('isPremiumWood', sql.Bit, prod.isPremiumWood ? 1 : 0)
            .input('woodType', sql.NVarChar, prod.woodType || '')
            .input('woodOrigin', sql.NVarChar, prod.woodOrigin || '')
            .input('isArtisanal', sql.Bit, prod.isArtisanal ? 1 : 0)
            .input('dimensions', sql.NVarChar, prod.dimensions || '')
            .input('priceRange', sql.NVarChar, prod.priceRange || '')
            .input('socialPostUrl', sql.NVarChar, prod.socialPostUrl || '')
            .query(`
                INSERT INTO products (
                    id, title, description, category, material, productType, price, images, creatorId, creatorName, creatorAvatar, creatorBio, city, state, contactWhatsapp, contactInstagram, contactFacebook, isPremiumWood, woodType, woodOrigin, isArtisanal, dimensions, priceRange, socialPostUrl
                ) VALUES (
                    @id, @title, @description, @category, @material, @productType, @price, @images, @creatorId, @creatorName, @creatorAvatar, @creatorBio, @city, @state, @contactWhatsapp, @contactInstagram, @contactFacebook, @isPremiumWood, @woodType, @woodOrigin, @isArtisanal, @dimensions, @priceRange, @socialPostUrl
                )
            `);

        res.status(201).json(prod);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Inicialização do Servidor na porta 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`EcoFlow Backend ativo e escutando na porta ${PORT}! 🌿🔌`);
});
```

---

## 3. PROMPT DE GERAÇÃO COMPLETA DO BACKEND (Copiar e colar na ferramenta de IA) 🤖💬

Copie e submeta o prompt estruturado abaixo na sua ferramenta de preferência para gerar os controladores adicionais em segundos:

```text
Por favor, gere um servidor backend completo em NodeJS + Express utilzando TypeScript que integra o portal de Design Circular EcoFlow com um Banco de Dados Microsoft SQL Server (MSSQL), utilizando o pacote NPM 'mssql' de forma totalmente assíncrona.

O projeto deve conter a seguinte arquitetura limpa:
1. ARQUIVO SCHEMA SQL: Contendo as tabelas 'users', 'products', 'comments', 'likes', 'saves', 'interests', e 'reports' com restrições de chaves estrangeiras (FOREIGN KEY REFERENCES) e exclusão em cascata (ON DELETE CASCADE) onde aplicável.
2. POOL DE CONEXÃO: Um Gerenciador de Banco de Dados que utiliza pools reutilizáveis com tratamento de erro em caso de perda de conexão ao SQL Server.
3. ROTAS E CONTROLADORES COMPLETOS (CRUD REST):
   - POST /api/auth/login : Recebe email e senha descritiva, valida o hash usando bcryptjs, e retorna o usuário logado.
   - POST /api/auth/register : Recebe o payload do ecoflow-user, gera o salt/hash da senha usando bcryptjs, insere no SQL Server e retorna 201 com sucesso.
   - GET /api/users : Retorna lista de todos os criadores registrados.
   - PUT /api/users/:id : Permite alterar campos do perfil de vendedor (como contatos, avatar e bio).
   - POST /api/users/:id/toggle-activation : Inativa/Reativa conta e todos os produtos do vendedor em lote (Soberania de Controle Administrativa).
   - GET /api/products : Retorna produtos cadastrados, trazendo os comentários aninhados em formato de sub-lista de cada anúncio.
   - POST /api/products : Insere novo produto sustentável persistindo as propriedades padrão e também as descrições extras de "Madeira Sustentável" (como woodType e woodOrigin de demolição).
   - PUT /api/products/:id : Permite ao vendedor editar informações do produto.
   - DELETE /api/products/:id : Exclui o anúncio do banco de dados na hora.
   - POST /api/products/:id/like : Alterna a curtida do usuário (caso já exista na tabela fato 'likes', remove. Caso contrário, insere, e incrementa/decrementa o contador 'likesCount' de 'products' em uma transação).
   - POST /api/products/:id/save : Alterna o salvamento do produto pelo vendedor na tabela 'saves'.
   - POST /api/products/:id/interest : Registra o interesse de compra do usuário e incrementa interesses.
   - POST /api/products/:id/comments : Insere um novo comentário/nota avaliativa e vincula ao anúncio.
   - GET /api/reports e POST /api/reports e DELETE /api/reports/:id : Fluxo de denúncias para a ferramenta de suporte do Administrador moderador.
   - POST /api/system/reset : Redefine o portal restabelecendo os dados zerados padrão (MOCK_PRODUCTS e Admin central).

Garanta que todas as strings de conexão e portas sejam configuradas usando .env de modo seguro, e que os CORS estejam habilitados para que o frontend React hospedeiro em qualquer origem possa consumi-los com segurança. Retorne código estruturado, comentado e com tipagem TypeScript completa.
```

Pronto para publicar! 🌿🚀
