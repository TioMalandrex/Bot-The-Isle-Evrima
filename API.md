# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Endpoints

### Players

#### Get Player Information
```http
GET /api/player/:discordId
```

**Parameters:**
- `discordId` (path) - Discord ID do jogador

**Response:**
```json
{
  "id": 1,
  "discord_id": "123456789",
  "steam_id": null,
  "username": "PlayerName",
  "created_at": "2024-01-01T00:00:00.000Z"
}
```

---

### Garage

#### List Garage Items
```http
GET /api/garage/:discordId
```

**Parameters:**
- `discordId` (path) - Discord ID do jogador

**Response:**
```json
[
  {
    "id": 1,
    "player_id": 1,
    "dinosaur_type": "Carnotaurus",
    "dinosaur_name": "Rex",
    "growth_stage": 1.0,
    "stats": "{}",
    "stored_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Store Dinosaur
```http
POST /api/garage
```

**Body:**
```json
{
  "discordId": "123456789",
  "dinosaurType": "Carnotaurus",
  "dinosaurName": "Rex",
  "growthStage": 1.0,
  "stats": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Dinossauro armazenado com sucesso"
}
```

#### Delete Garage Item
```http
DELETE /api/garage/:id
```

**Parameters:**
- `id` (path) - ID do item na garagem

**Response:**
```json
{
  "success": true,
  "message": "Dinossauro removido da garagem"
}
```

---

### Skins

#### List Player Skins
```http
GET /api/skins/:discordId?type=DinosaurType
```

**Parameters:**
- `discordId` (path) - Discord ID do jogador
- `type` (query, optional) - Filtrar por tipo de dinossauro

**Response:**
```json
[
  {
    "id": 1,
    "player_id": 1,
    "dinosaur_type": "Carnotaurus",
    "skin_id": "skin_001",
    "skin_name": "Desert Camo",
    "skin_data": "{}",
    "unlocked_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### Unlock Skin
```http
POST /api/skins/unlock
```

**Body:**
```json
{
  "discordId": "123456789",
  "dinosaurType": "Carnotaurus",
  "skinId": "skin_001",
  "skinName": "Desert Camo",
  "skinData": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skin desbloqueada com sucesso"
}
```

#### Apply Skin
```http
POST /api/skins/apply
```

**Body:**
```json
{
  "discordId": "123456789",
  "dinosaurType": "Carnotaurus",
  "skinId": "skin_001"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skin aplicada com sucesso"
}
```

**Error Response:**
```json
{
  "error": "Você não possui essa skin"
}
```

#### Get Active Skin
```http
GET /api/skins/active/:discordId/:dinosaurType
```

**Parameters:**
- `discordId` (path) - Discord ID do jogador
- `dinosaurType` (path) - Tipo do dinossauro

**Response:**
```json
{
  "id": 1,
  "player_id": 1,
  "dinosaur_type": "Carnotaurus",
  "skin_id": "skin_001",
  "skin_name": "Desert Camo",
  "skin_data": "{}",
  "unlocked_at": "2024-01-01T00:00:00.000Z",
  "applied_at": "2024-01-01T01:00:00.000Z"
}
```

---

### System

#### Server Status
```http
GET /api/status
```

**Response:**
```json
{
  "gameServerConnected": true,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Responses

Todos os endpoints podem retornar os seguintes códigos de erro:

### 404 Not Found
```json
{
  "error": "Jogador não encontrado"
}
```

### 400 Bad Request
```json
{
  "error": "Você não possui essa skin"
}
```

### 500 Internal Server Error
```json
{
  "error": "Mensagem de erro"
}
```

---

## Tipos de Dinossauros

Os seguintes tipos de dinossauros são suportados:
- `Carnotaurus`
- `Ceratosaurus`
- `Pachycephalosaurus`
- `Stegosaurus`
- `Tenontosaurus`
- `Triceratops`
- `Utahraptor`

---

## Exemplos de Uso

### JavaScript (Fetch)

```javascript
// Obter garagem do jogador
const response = await fetch('http://localhost:3000/api/garage/123456789');
const garage = await response.json();

// Armazenar dinossauro
const response = await fetch('http://localhost:3000/api/garage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    discordId: '123456789',
    dinosaurType: 'Carnotaurus',
    dinosaurName: 'Rex',
    growthStage: 1.0,
    stats: {}
  })
});
```

### Python (requests)

```python
import requests

# Obter skins do jogador
response = requests.get('http://localhost:3000/api/skins/123456789')
skins = response.json()

# Aplicar skin
response = requests.post('http://localhost:3000/api/skins/apply', json={
    'discordId': '123456789',
    'dinosaurType': 'Carnotaurus',
    'skinId': 'skin_001'
})
```

### cURL

```bash
# Obter perfil do jogador
curl http://localhost:3000/api/player/123456789

# Desbloquear skin
curl -X POST http://localhost:3000/api/skins/unlock \
  -H "Content-Type: application/json" \
  -d '{
    "discordId": "123456789",
    "dinosaurType": "Carnotaurus",
    "skinId": "skin_001",
    "skinName": "Desert Camo",
    "skinData": {}
  }'
```
