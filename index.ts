import { PluginSDK } from '@logitech/plugin-sdk';
import { BeamctlAdjustment, BeamctlCommand, presetNames } from './src/actions';

const pluginSDK = new PluginSDK();

// Register plugin actions
pluginSDK.registerAction(new BeamctlCommand('toggle', 'Toggle Light', 'Turn the front light on or off', ['toggle']));
pluginSDK.registerAction(new BeamctlCommand('back_toggle', 'Toggle Back Light', 'Turn the back RGB light on or off', ['back', 'toggle']));
pluginSDK.registerAction(new BeamctlCommand('back_color', 'Back Color', 'Choose the back RGB light colour in the macOS colour picker', ['back', 'pick']));
pluginSDK.registerAction(new BeamctlAdjustment('brightness', 'Brightness', 'Adjust the front light brightness', ['brightness'], 5));
pluginSDK.registerAction(new BeamctlAdjustment('temperature', 'Temperature', 'Adjust the front light colour temperature', ['temp'], 100));
pluginSDK.registerAction(new BeamctlAdjustment('back_brightness', 'Back Brightness', 'Adjust the back RGB light brightness', ['back', 'brightness'], 5));

for (const preset of presetNames()) {
  pluginSDK.registerAction(new BeamctlCommand(`preset_${preset}`, `Preset: ${preset}`, `Apply the "${preset}" preset`, ['preset', preset]));
}

await pluginSDK.connect();
