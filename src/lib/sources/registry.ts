import { JobSourceAdapter } from "./types";
import { JobStreetAdapter } from "./jobstreet-adapter";
import { FounditAdapter } from "./foundit-adapter";
import { PhilJobNetAdapter } from "./philjobnet-adapter";
import { KalibrrAdapter } from "./kalibrr-adapter";
import { BpoDirectAdapter } from "./bpo-direct-adapter";

class SourceRegistry {
  private adapters = new Map<string, JobSourceAdapter>();

  constructor() {
    this.register(new JobStreetAdapter());
    this.register(new FounditAdapter());
    this.register(new PhilJobNetAdapter());
    this.register(new KalibrrAdapter());
    this.register(new BpoDirectAdapter());
  }

  private register(adapter: JobSourceAdapter) {
    this.adapters.set(adapter.sourceKey, adapter);
  }

  getAdapter(key: string): JobSourceAdapter | undefined {
    return this.adapters.get(key);
  }

  getAllAdapters(): JobSourceAdapter[] {
    return Array.from(this.adapters.values());
  }
}

export const registry = new SourceRegistry();
export default registry;
