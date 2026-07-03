// =====================================================================
// ASSET LOADER — carrega o manifest de sprites e pré-carrega os PNGs que
// tiverem "src". Guarda um cache type -> { def, image|null }. Quem não tem
// arte real fica com image=null e cai no placeholder procedural no render.
// =====================================================================
const MANIFEST_URL = "/assets/sprites/manifest.json";
const SPRITES_BASE = "/assets/sprites/";

class AssetLoader {
  constructor() {
    this.cache = {}; // type -> { def, image }
    this.ready = false;
    this._loading = null;
  }

  // Carrega manifest + imagens uma única vez. Idempotente.
  async load() {
    if (this.ready) return;
    if (this._loading) return this._loading;
    this._loading = this._doLoad();
    return this._loading;
  }

  async _doLoad() {
    let manifest;
    try {
      const res = await fetch(MANIFEST_URL);
      manifest = await res.json();
    } catch (err) {
      console.warn("[AssetLoader] manifest não carregou, só placeholders:", err);
      this.ready = true;
      return;
    }

    const sprites = manifest.sprites || {};
    const jobs = Object.entries(sprites).map(([type, def]) =>
      this._loadOne(type, def)
    );
    await Promise.all(jobs);
    this.ready = true;
  }

  _loadOne(type, def) {
    return new Promise((resolve) => {
      if (!def.src) {
        this.cache[type] = { def, image: null }; // placeholder
        return resolve();
      }
      const img = new Image();
      img.onload = () => {
        this.cache[type] = { def, image: img };
        resolve();
      };
      img.onerror = () => {
        console.warn(`[AssetLoader] falhou ao carregar ${def.src}, placeholder`);
        this.cache[type] = { def, image: null };
        resolve();
      };
      img.src = SPRITES_BASE + def.src;
    });
  }

  get(type) {
    return this.cache[type] || null;
  }
}

export const assets = new AssetLoader();
