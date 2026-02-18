# Exemplo de Skins para The Isle Evrima (Build 21811079 - Fevereiro 2026)

Este arquivo contém exemplos de IDs de skins que podem ser usados para testar o sistema com todos os dinossauros disponíveis.

## CARNÍVOROS

### Carnotaurus
- `carno_default` - Padrão
- `carno_desert` - Deserto
- `carno_jungle` - Selva
- `carno_night` - Noturno
- `carno_albino` - Albino

### Omniraptor
- `omni_default` - Padrão
- `omni_hunter` - Caçador
- `omni_stealth` - Furtivo
- `omni_forest` - Floresta

### Ceratosaurus
- `cerato_default` - Padrão
- `cerato_swamp` - Pântano
- `cerato_volcanic` - Vulcânico
- `cerato_forest` - Floresta

### Troodon
- `troodon_default` - Padrão
- `troodon_night` - Noturno
- `troodon_pack` - Matilha
- `troodon_shadow` - Sombra

### Dilophosaurus
- `dilo_default` - Padrão
- `dilo_spitter` - Cuspidor
- `dilo_rainforest` - Floresta Tropical
- `dilo_venom` - Veneno

### Pteranodon
- `ptero_default` - Padrão
- `ptero_coastal` - Costeiro
- `ptero_sky` - Céu
- `ptero_fisher` - Pescador

### Herrerasaurus
- `herra_default` - Padrão
- `herra_primal` - Primitivo
- `herra_pack` - Matilha
- `herra_desert` - Deserto

### Deinosuchus
- `deino_default` - Padrão
- `deino_swamp` - Pântano
- `deino_river` - Rio
- `deino_apex` - Apex

### Allosaurus
- `allo_default` - Padrão
- `allo_apex` - Apex
- `allo_hunter` - Caçador
- `allo_territorial` - Territorial
- `allo_alpha` - Alpha

### Tyrannosaurus rex
- `rex_default` - Padrão
- `rex_apex` - Apex
- `rex_king` - Rei
- `rex_alpha` - Alpha
- `rex_nightmare` - Pesadelo

## HERBÍVOROS

### Stegosaurus
- `stego_default` - Padrão
- `stego_woodland` - Bosque
- `stego_savanna` - Savana
- `stego_arctic` - Ártico

### Tenontosaurus
- `tenonto_default` - Padrão
- `tenonto_grassland` - Gramado
- `tenonto_wetland` - Terras Úmidas
- `tenonto_plains` - Planície

### Hypsilophodon
- `hypsi_default` - Padrão
- `hypsi_forest` - Floresta
- `hypsi_quick` - Veloz
- `hypsi_camouflage` - Camuflagem

### Pachycephalosaurus
- `pachy_default` - Padrão
- `pachy_mountain` - Montanha
- `pachy_plains` - Planície
- `pachy_tropical` - Tropical

### Diabloceratops
- `diablo_default` - Padrão
- `diablo_highland` - Terras Altas
- `diablo_defender` - Defensor
- `diablo_elder` - Ancião

### Dryosaurus
- `dryo_default` - Padrão
- `dryo_runner` - Corredor
- `dryo_forest` - Floresta
- `dryo_swift` - Ágil

### Maiasaura
- `maia_default` - Padrão
- `maia_nesting` - Nidificante
- `maia_herd` - Rebanho
- `maia_plains` - Planície

### Triceratops
- `trike_default` - Padrão
- `trike_highland` - Terras Altas
- `trike_coastal` - Costeiro
- `trike_canyon` - Canyon
- `trike_elder` - Ancião

## ONÍVOROS

### Gallimimus
- `galli_default` - Padrão
- `galli_runner` - Corredor
- `galli_plains` - Planície
- `galli_swift` - Veloz

### Beipiaosaurus
- `bei_default` - Padrão
- `bei_feathered` - Emplumado
- `bei_forest` - Floresta
- `bei_scavenger` - Necrófago

---

## Como usar via Discord

Para desbloquear uma skin:
```
/skins unlock tipo:Tyrannosaurus skin_id:rex_apex nome:"T-Rex Apex"
```

Para aplicar uma skin:
```
/changeskin tipo:Tyrannosaurus skin:rex_apex
```

## Como usar via API

```javascript
// Desbloquear skin do T-Rex
fetch('http://localhost:3000/api/skins/unlock', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    discordId: 'SEU_DISCORD_ID',
    dinosaurType: 'Tyrannosaurus',
    skinId: 'rex_apex',
    skinName: 'T-Rex Apex',
    skinData: { color: '#8B0000', pattern: 'apex_scales' }
  })
});

// Desbloquear skin do Allosaurus
fetch('http://localhost:3000/api/skins/unlock', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    discordId: 'SEU_DISCORD_ID',
    dinosaurType: 'Allosaurus',
    skinId: 'allo_hunter',
    skinName: 'Allo Caçador',
    skinData: { color: '#4B0082', pattern: 'hunter_stripes' }
  })
});
```

**Nota:** Estes são IDs de exemplo compatíveis com a Build 21811079 (Fevereiro 2026). Os IDs reais de skin devem corresponder aos configurados no servidor The Isle Evrima.
