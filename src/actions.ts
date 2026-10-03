import { AdjustmentAction, CommandAction } from '@logitech/plugin-sdk';
import type { AdjustmentActionExecuteEvent } from '@logitech/plugin-sdk';
import { execFile, execFileSync } from 'child_process';
import { existsSync } from 'fs';
import os from 'os';
import path from 'path';
import { promisify } from 'util';

const BINARY = process.platform === 'win32' ? 'beamctl.exe' : 'beamctl';

// The beamctl CLI is installed separately. On macOS the Logi Plugin Service
// runs with a launchd PATH, so look in the usual install locations first.
const LOCATIONS = [
  path.join(os.homedir(), '.local', 'bin', BINARY),
  '/opt/homebrew/bin/beamctl',
  '/usr/local/bin/beamctl',
  path.join(os.homedir(), 'go', 'bin', BINARY),
];

// Checked on every call so that installing beamctl needs no plugin reload.
// When it is in none of the locations, the bare name leaves the lookup to PATH.
function beamctlPath(): string {
  return LOCATIONS.find((location) => existsSync(location)) ?? BINARY;
}

const run = promisify(execFile);

// windowsHide keeps a console window from flashing up on Windows for every
// call. The colour picker is run without it, because starting a process with
// its windows hidden may hide the picker's dialog as well.
async function beamctl(...args: string[]): Promise<void> {
  await run(beamctlPath(), args, { windowsHide: !args.includes('pick') });
}

/** Preset names from ~/.config/beamctl/presets.json; reading them does not touch the light. */
export function presetNames(): string[] {
  try {
    return execFileSync(beamctlPath(), ['preset'], { encoding: 'utf8', windowsHide: true }).split('\n').filter(Boolean);
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
    private readonly step: number,
    private readonly unit = 1
  ) {
    super();
  }

  // Each call to the light takes 100-400 ms over Bluetooth, so ticks that
  // arrive meanwhile are summed and sent as one relative change. `step` may be
  // a fraction of `unit`, the smallest change beamctl accepts: only whole
  // units are sent and the rest stays in `pending` for the next tick.
  async execute(event: AdjustmentActionExecuteEvent) {
    this.pending += event.tick * this.step;
    if (this.busy) {
      return;
    }
    this.busy = true;
    try {
      for (let delta = this.wholeUnits(); delta !== 0; delta = this.wholeUnits()) {
        this.pending -= delta;
        await beamctl(...this.args, delta > 0 ? `+${delta}` : `${delta}`);
      }
    } finally {
      this.busy = false;
    }
  }

  private wholeUnits(): number {
    return Math.trunc(this.pending / this.unit) * this.unit;
  }
}
