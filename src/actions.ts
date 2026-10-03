import { AdjustmentAction, CommandAction } from '@logitech/plugin-sdk';
import type { AdjustmentActionExecuteEvent } from '@logitech/plugin-sdk';
import { execFile, execFileSync } from 'child_process';
import { existsSync } from 'fs';
import os from 'os';
import path from 'path';
import { promisify } from 'util';

// The beamctl CLI is installed separately. The Logi Plugin Service runs with a
// launchd PATH, so look in the usual install locations instead of by name.
const LOCATIONS = [
  path.join(os.homedir(), '.local', 'bin', 'beamctl'),
  '/opt/homebrew/bin/beamctl',
  '/usr/local/bin/beamctl',
  path.join(os.homedir(), 'go', 'bin', 'beamctl'),
];

// Checked on every call so that installing beamctl needs no plugin reload.
function beamctlPath(): string {
  return LOCATIONS.find((location) => existsSync(location)) ?? LOCATIONS[0]!;
}

const run = promisify(execFile);

async function beamctl(...args: string[]): Promise<void> {
  await run(beamctlPath(), args);
}

/** Preset names from ~/.config/beamctl/presets.json; reading them does not touch the light. */
export function presetNames(): string[] {
  try {
    return execFileSync(beamctlPath(), ['preset'], { encoding: 'utf8' }).split('\n').filter(Boolean);
  } catch (error) {
    console.error('Cannot read beamctl presets:', (error as Error).message);
    return [];
  }
}

export class BeamctlCommand extends CommandAction {
  constructor(
    readonly name: string,
    public displayName: string,
    public description: string,
    private readonly args: string[]
  ) {
    super();
  }

  async onKeyDown() {
    await beamctl(...this.args);
  }
}

export class BeamctlAdjustment extends AdjustmentAction {
  readonly hasReset = false;
  private pending = 0;
  private busy = false;

  constructor(
    readonly name: string,
    public displayName: string,
    public description: string,
    private readonly args: string[],
    private readonly step: number
  ) {
    super();
  }

  // Each call to the light takes 100-400 ms over Bluetooth, so ticks that
  // arrive meanwhile are summed and sent as one relative change.
  async execute(event: AdjustmentActionExecuteEvent) {
    this.pending += event.tick * this.step;
    if (this.busy) {
      return;
    }
    this.busy = true;
    try {
      while (this.pending !== 0) {
        const delta = this.pending;
        this.pending = 0;
        await beamctl(...this.args, delta > 0 ? `+${delta}` : `${delta}`);
      }
    } finally {
      this.busy = false;
    }
  }
}
