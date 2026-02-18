# Exemplo de Skins para The Isle Evrima

Este arquivo contém exemplos de IDs de skins que podem ser usados para testar o sistema.

## Carnotaurus
- `carno_default` - Padrão
- `carno_desert` - Deserto
- `carno_jungle` - Selva
- `carno_night` - Noturno
- `carno_albino` - Albino

## Ceratosaurus
- `cerato_default` - Padrão
- `cerato_swamp` - Pântano
- `cerato_volcanic` - Vulcânico
- `cerato_forest` - Floresta

## Pachycephalosaurus
- `pachy_default` - Padrão
- `pachy_mountain` - Montanha
- `pachy_plains` - Planície
- `pachy_tropical` - Tropical

## Stegosaurus
- `stego_default` - Padrão
- `stego_woodland` - Bosque
- `stego_savanna` - Savana
- `stego_arctic` - Ártico

## Tenontosaurus
- `tenonto_default` - Padrão
- `tenonto_grassland` - Gramado
- `tenonto_wetland` - Terras Úmidas

## Triceratops
- `trike_default` - Padrão
- `trike_highland` - Terras Altas
- `trike_coastal` - Costeiro
- `trike_canyon` - Canyon

## Utahraptor
- `utah_default` - Padrão
- `utah_hunter` - Caçador
- `utah_shadow` - Sombra
- `utah_desert` - Deserto
- `utah_arctic` - Ártico

---

## Como usar via Discord

Para desbloquear uma skin:
```
/skins unlock tipo:Carnotaurus skin_id:carno_desert nome:"Deserto"
```

Para aplicar uma skin:
```
/changeskin tipo:Carnotaurus skin:carno_desert
```

## Como usar via API

```javascript
// Desbloquear skin
fetch('http://localhost:3000/api/skins/unlock', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    discordId: 'SEU_DISCORD_ID',
    dinosaurType: 'Carnotaurus',
    skinId: 'carno_desert',
    skinName: 'Deserto',
    skinData: { color: '#FFD700', pattern: 'desert_camo' }
  })
});
```

**Nota:** Estes são IDs de exemplo. Os IDs reais de skin devem corresponder aos configurados no servidor The Isle Evrima.
